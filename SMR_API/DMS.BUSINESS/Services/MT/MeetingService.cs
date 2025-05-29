using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE.Entities.MD;
using DMS.CORE;
using Microsoft.EntityFrameworkCore;
using DMS.CORE.Entities.MT;
using DMS.BUSINESS.Dtos.MT;

namespace DMS.BUSINESS.Services.MT
{
    public interface IMeetingService : IGenericService<TblMtMeeting, MeetingDto>
    {
        Task<IList<MeetingDto>> GetAll(BaseMdFilter filter);

    }
    public class MeetingService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMtMeeting, MeetingDto>(dbContext, mapper), IMeetingService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMtMeeting.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Name.Contains(filter.KeyWord));
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
                var query = _dbContext.TblMtMeeting.AsQueryable();
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
