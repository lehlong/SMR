using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE;
using DMS.CORE.Entities.MD;
using DocumentFormat.OpenXml.Office2013.Word;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NPOI.HPSF;
using NPOI.HSSF.Record.Chart;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Services.MD
{
    public interface IMeetingService : IGenericService<TblMdMeeting, MeetingDto>
    {
        Task<IList<MeetingDto>> GetAll(BaseMdFilter filter);
        Task<PagedResponseDto> Search(BaseFilter filter);
       
        Task<MeetingDto> Adddata(IDto dto, List<MeetingPeopleDto> participant, List<IFormFile> file);
        Task<(List<MeetingPeopleDto> People, List<object> Files)> GetAllPeopleMeeting(string HeaderId);
        Task<IList<MeetingFileDto>> GetFile(string headerId);
        Task<ActionResult> UpdateDB(IDto dto, List<MeetingPeopleDto> participant, List<IFormFile> file,string filelst);
    }
    public class MeetingService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdMeeting, MeetingDto>(dbContext, mapper), IMeetingService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdMeeting.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.MeetingTitle.ToString().Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query, filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<IList<MeetingDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdMeeting.AsQueryable();
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await base.GetAllMd(query, filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<(List<MeetingPeopleDto> People, List<object> Files)> GetAllPeopleMeeting(string HeaderId)
        {
            try
            {
                var query1 = _dbContext.TblMdMeetingPeolple
                    .Where(x => x.headerID.ToString() == HeaderId);
                var query = _dbContext.tblMdMeetingFiles.Where(x => x.HeaderId.ToString() == HeaderId);

                var People = _mapper.Map<IList<MeetingPeopleDto>>(await query1.ToListAsync()).ToList();
                var file = _mapper.Map<IList<MeetingFileDto>>(await query.ToListAsync()).ToList();
                var fileDetailsList = new List<object>();
                foreach (var item in file)
                {


                    var filepath = item.FilePath.Replace("/", @"\");
                    var fileInfo = new FileInfo(filepath);

                    fileDetailsList.Add(new
                    {
                        Id = item.Id,
                        Name = item.FileName,
                        FilePath = fileInfo.FullName,
                        FileSize = fileInfo.Length,
                        CreatedDate = fileInfo.CreationTime
                    });


                }


                return (People, fileDetailsList);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return (new List<MeetingPeopleDto>(), new List<object>());
            }
        }
        public async Task<IList<MeetingFileDto>> GetFile(string headerId)
        {
            try
            {
                var query = _dbContext.tblMdMeetingFiles.AsQueryable().Where(x => x.HeaderId.ToString() == headerId);

                return _mapper.Map<IList<MeetingFileDto>>(await query.ToListAsync());
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<MeetingDto> Adddata(IDto dto, List<MeetingPeopleDto> participant, List<IFormFile> file)
        {
            var realDto = dto as MeetingDto;
            var headerid = Guid.NewGuid();
            realDto.id = headerid;

            var data = await base.Add(dto);

            var entities = participant.Select(dtos => new TblMdMeetingPeolple
            {
                Id = Guid.NewGuid(),
                headerID = headerid,
                userName = dtos.userName,
                Fullname = dtos.Fullname,
                Device = "", // Adjust as needed
                Seat = dtos.Seat ?? 0,
                RoleMeeting = dtos.RoleMeeting
            }).ToList();

            _dbContext.TblMdMeetingPeolple.AddRange(entities);

            await _dbContext.SaveChangesAsync();
            SaveFile(file, headerid);

            return data;
        }

        public class FileDto
        {
            public string? Name { get; set; }
        }
        public async Task<ActionResult> UpdateDB(IDto dto, List<MeetingPeopleDto> participant, List<IFormFile> file, string filelst)
        {
            try { 
            var realDto = dto as MeetingDto;
            var headerid = realDto.id;
            var Lstfile = JsonConvert.DeserializeObject<List<FileDto>>(filelst);
             var fileNames = Lstfile.Select(y => y.Name).ToList();

                await base.Update(dto);

            var meetingFilesQuery = _dbContext.tblMdMeetingFiles.Where(x => x.HeaderId == headerid.ToString() && !fileNames.Contains(x.FileName));
            string targetDirectory = Path.Combine(Directory.GetCurrentDirectory());
            if (meetingFilesQuery.Count() > 0) {
            foreach (var item in meetingFilesQuery)
            {
                var path = Path.Combine(targetDirectory, item.FilePath.Replace("/", @"\"));
                if (File.Exists(path))
                {
                    File.Delete(path);

                }
            }
                }


            var participantList = _dbContext.TblMdMeetingPeolple.Where(x => x.headerID == headerid);
            _dbContext.RemoveRange(meetingFilesQuery);
            _dbContext.SaveChanges();

                var entities = participant.Select(dtos => new TblMdMeetingPeolple
            {
                Id = Guid.NewGuid(),
                headerID = headerid,
                userName = dtos.userName,
                Fullname = dtos.Fullname,
                Device = "",
                Seat = dtos.Seat ?? 0,
                RoleMeeting = dtos.RoleMeeting
            }).ToList();

            _dbContext.TblMdMeetingPeolple.AddRange(entities);

            await _dbContext.SaveChangesAsync();



            SaveFile(file, headerid);
            return null;
            }catch (Exception ex)
            {
                Status = false;
                return null;
            }

        }
        public void SaveFile(List<IFormFile> File, Guid? headerId)
        {
            try
            {
                string targetDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Filedocument");

                var today = DateTime.Now;
                if (!Directory.Exists(targetDirectory))
                {
                    Directory.CreateDirectory(targetDirectory);
                }
                var fileEntities = new List<TblMdMeetingFile>().ToList();
                foreach (var file in File)
                {
                    if (file != null && file.Length > 0)
                       
                    {
                        
                        string uniqueFileName = $"{today.Year}/{today.Month}/{today.Day}/{today.Second}{Path.GetFileName(file.FileName)}";
                        string fileName = Path.GetFileName(file.FileName);
                        string filePath = Path.Combine(targetDirectory, uniqueFileName);
                      
                        var path = Path.Combine("Uploads/Filedocument", uniqueFileName);

                        string directoryPath = Path.GetDirectoryName(filePath);


                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }

                        fileEntities.Add(new TblMdMeetingFile
                        {
                            Id = Guid.NewGuid(),
                            HeaderId = headerId.ToString(),
                            FilePath = path.Replace("/", @"\"),
                            Type = Path.GetExtension(filePath),
                            FileName = fileName
                        });

                    }

                }
                _dbContext.tblMdMeetingFiles.AddRange(fileEntities);
                _dbContext.SaveChanges();




            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;

            }
        }
    }
}
