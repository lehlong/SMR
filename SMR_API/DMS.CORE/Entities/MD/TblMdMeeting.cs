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
        [Column("CHAIR_PERSON")]
        public string? ChairPerson { get; set; }
        [Column("TIME")]
        public DateTime Time { get; set; }
    }
}
