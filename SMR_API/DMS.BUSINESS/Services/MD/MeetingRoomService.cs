using AutoMapper;
using Common;
using Common.Util;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Services.MD
{
    public interface IMeetingRoomService : IGenericService<TblMdMeetingRoom, MeetingRoomDto>
    {
        Task<IList<MeetingRoomDto>> GetAll(BaseMdFilter filter);

    }
    public class MeetingRoomService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdMeetingRoom, MeetingRoomDto>(dbContext, mapper), IMeetingRoomService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdMeetingRoom.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Id.ToString().Contains(filter.KeyWord) || x.Name.Contains(filter.KeyWord));
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


        public async Task<IList<MeetingRoomDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdMeetingRoom.AsQueryable();
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

        public override async Task<MeetingRoomDto> Add(IDto dto)
        {
            var realDto = dto as MeetingRoomDto;

            if (realDto.ImageBase64 != null && realDto.ImageBase64 != "")
            {
                realDto.UrlImg = SaveBase64ToFile(realDto.ImageBase64);
            }
            realDto.id = Guid.NewGuid();
            var data = await base.Add(dto);
            return data;
        }
        public string SaveBase64ToFile(string base64String)
        {
            try
            {
                if (base64String.Contains(","))
                {
                    base64String = base64String.Split(',')[1];
                }
                byte[] fileBytes = Convert.FromBase64String(base64String);
                string rootPath = "Uploads/Imagesroom";
                string datePath = $"{DateTime.Now:yyyy/MM/dd}";
                string fullPath = Path.Combine(rootPath, datePath);
                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }
                string fileName = $"{Guid.NewGuid()}.jpg";
                string filePath = Path.Combine(fullPath, fileName);
                File.WriteAllBytes(filePath, fileBytes);
                return Path.Combine(rootPath, datePath, fileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return null;
            }
        }

        public override async Task Update(IDto dto)
        {
            try
            {

                var dt = dto as MeetingRoomDto;
                if (dt.ImageBase64 != null && dt.ImageBase64 != "")
                {
                    dt.UrlImg = SaveBase64ToFile(dt.ImageBase64);
                }
                await base.Update(dto);
            }
            catch (Exception ex)
            {
                this.Status = false;
                Console.WriteLine($"Lỗi: {ex.Message}");

            }
        }
    }
}
