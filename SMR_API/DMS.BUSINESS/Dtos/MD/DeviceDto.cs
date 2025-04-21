using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DMS.BUSINESS.Dtos.MD
{
    public class DeviceDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        [Description("Id")]
        public Guid? id { get; set; }

        [Description("Tên thiết bị")]
        public string name { get; set; }

        [Description("Loại thiết bị")]
        public string? type { get; set; }
  



        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdDevice, DeviceDto>().ReverseMap();
        }
    }
}
