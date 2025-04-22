using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.BUSINESS.Dtos.MD
{
    public class DeviceTypeDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public string? Note { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdDeviceType, DeviceTypeDto>().ReverseMap();
        }
    }
}
