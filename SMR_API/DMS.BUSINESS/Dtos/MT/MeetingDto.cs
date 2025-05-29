using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using DMS.CORE.Entities.MT;

namespace DMS.BUSINESS.Dtos.MT
{
    public class MeetingDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string? RoomCode { get; set; }
        public DateTime? DeviceType { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public List<TblMtMeetingFile> Files { get; set; } = new List<TblMtMeetingFile>();
        public List<TblMtMeetingResource> Resources { get; set; } = new List<TblMtMeetingResource>();
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMtMeeting, MeetingDto>().ReverseMap();
        }
    }
}
