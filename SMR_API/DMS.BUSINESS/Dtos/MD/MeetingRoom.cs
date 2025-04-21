using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DMS.BUSINESS.Dtos.MD
{
    public class MeetingRoomDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        [Description("Id")]
        public Guid? id { get; set; }

        [Description("Tên phòng họp")]
        public string name { get; set; }

        [Description("Loại phòng họp")]
        public string? type { get; set; }

        [Description("Kích thước phòng họp")]
        public int? Size { get; set; }

        [Description("Tầng")]
        public int? Floor { get; set; }

        [Description("URL hình ảnh")]
        public string? UrlImg { get; set; }

        [Description("Đường dẫn file")]
        public string? FilePath { get; set; }
        [Description("file ảnh")]
        public string? ImageBase64 { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdMeetingRoom, MeetingRoomDto>().ReverseMap();
        }
    }
}
