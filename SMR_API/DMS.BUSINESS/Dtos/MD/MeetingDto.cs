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
  
        public Guid? id { get; set; }

        [Description("Nội dung cuộc họp")]
        public string? meetingContent { get; set; }
        [Description("Tiêu đề bắt đầu ")]
        public string? meetingTitle { get; set; }
        [Description("Địa điểm cuộc họp ")]

        public string? MeetingRoomid { get; set; }

        [Description("thời gian bắt đầu ")]
        public DateTime startDate { get; set; }
        [Description("thời gian kết thúc ")]
        public DateTime endDate { get; set; }

        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdMeeting, MeetingDto>().ReverseMap();
        }
    }
}
