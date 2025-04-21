using DMS.CORE.Common;
using NPOI.HPSF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_MEETING")]
    public class TblMdMeeting : BaseEntity
    {
        [Key]
        [Column("ID")]
        public Guid? Id { get; set; }
        [Column("MEETING_TITLE", TypeName = "NVARCHAR(255)")]
        public string? MeetingTitle { get; set; }
        [Column("MEETING_CONTENT", TypeName = "NVARCHAR(255)")]
        public string? MeetingContent { get; set; }
     
        [Column("MEETING_ROOM_ID")]

        public string? MeetingRoomid { get; set; }
        [Column("START_DATE")]
        public DateTime? startDate { get; set; }
        
        [Column("END_DATE")]
        public DateTime? endDate { get; set; }
    }
}
