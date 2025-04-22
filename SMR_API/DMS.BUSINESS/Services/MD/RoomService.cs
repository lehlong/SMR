using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE;
using DMS.CORE.Entities.MD;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Services.MD
{
    public interface IRoomService : IGenericService<TblMdRoom, RoomDto>
    {
        Task<IList<RoomDto>> GetAll(BaseMdFilter filter);
        Task<List<TblMdRoomDevice>> GetDeviceByRoom(string code);
        Task UpdateInfo(RoomDto data);
        Task CreateInfo(RoomDto data);
    }
    public class RoomService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdRoom, RoomDto>(dbContext, mapper), IRoomService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdRoom.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Code.ToString().Contains(filter.KeyWord) || x.Name.Contains(filter.KeyWord));
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


        public async Task<IList<RoomDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdRoom.AsQueryable();
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

        public async Task<List<TblMdRoomDevice>> GetDeviceByRoom(string code)
        {
            try
            {
                return await _dbContext.TblMdRoomDevice.Where(x => x.RoomCode == code).ToListAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task UpdateInfo(RoomDto data)
        {
            try
            {
                if (ServiceExtension.IsBase64String(data.FilePath))
                {
                    data.FilePath = ServiceExtension.SaveBase64ToFile(data.FilePath);
                }
                _dbContext.TblMdRoom.Update(_mapper.Map<TblMdRoom>(data));

                foreach (var i in data.ListDevice)
                {
                    if (string.IsNullOrEmpty(i.Code))
                    {
                        i.Code = Guid.NewGuid().ToString();
                        _dbContext.TblMdRoomDevice.Add(i);
                    }
                    else
                    {
                        _dbContext.TblMdRoomDevice.Update(i);
                    }
                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public async Task CreateInfo(RoomDto data)
        {
            try
            {
                var code = Guid.NewGuid().ToString();
                if (ServiceExtension.IsBase64String(data.FilePath))
                {
                    data.FilePath = ServiceExtension.SaveBase64ToFile(data.FilePath);
                }
                data.Code = code;
                _dbContext.TblMdRoom.Add(_mapper.Map<TblMdRoom>(data));

                foreach (var i in data.ListDevice)
                {
                    i.Code = Guid.NewGuid().ToString();
                    i.RoomCode = code;
                    _dbContext.TblMdRoomDevice.Add(i);
                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
    }
}
