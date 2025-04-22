using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
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
    public interface IDeviceTypeService : IGenericService<TblMdDeviceType, DeviceTypeDto>
    {
        Task<IList<DeviceTypeDto>> GetAll(BaseMdFilter filter);

    }
    public class DeviceTypeService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdDeviceType, DeviceTypeDto>(dbContext, mapper), IDeviceTypeService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdDeviceType.AsQueryable();
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


        public async Task<IList<DeviceTypeDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdDeviceType.AsQueryable();
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
    }
}
