using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Dtos.MD
{
    public class MeetingPeopleDto : BaseMdDto, IMapFrom, IDto
    {
       
        [Key]
        [Description("Id")]
        public Guid? Id { get; set; }
        [Description("ID cuộc họp")]
        public Guid? headerID { get; set; }

        [Description("Username")]
        public string userName { get; set; }
        [Description("Fullname")]
        public string Fullname { get; set; }
        [Description("Thiết bị")]
        public string? Device { get; set; }
        [Description("vị trí ngồi")]
        public int? Seat { get; set; }
        [Description("Chức năng trong cuộc họp")]
        public string? RoleMeeting { get; set; }
        //public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdMeetingPeolple, MeetingPeopleDto>().ReverseMap();
        }
    }
}
