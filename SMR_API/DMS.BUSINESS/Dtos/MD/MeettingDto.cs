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
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.BUSINESS.Dtos.MD
{
    public class MeetingDto : BaseMdDto, IMapFrom, IDto
    {

        [Key]
        [Description("Id")]
  
        public Guid Id { get; set; }

        [Description("Nội dung cuộc họp")]
        public string? MeetingTitle { get; set; }
        
        [Description("Người chủ trì")]
        public string? ChairPerson { get; set; }
        [Description("thời gian")]
        public string? Time { get; set; }

        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdMeeting, MeetingDto>().ReverseMap();
        }
    }
}
