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
    public class MeetingFileDto : BaseMdDto, IMapFrom, IDto
    {
       
        [Key]
        [Description("Id")]
        public Guid? Id { get; set; }
        [Description("ID cuộc họp")]
        public string HeaderID { get; set; }
        [Description("Tên file")]
        public string? FileName { get; set; }
        [Description("Đường dẫn file")]
        public string FilePath { get; set; }
        [Description("Thể loại")]
        public string? Type { get; set; }

        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdMeetingFile, MeetingFileDto>().ReverseMap();
        }
    }
}
