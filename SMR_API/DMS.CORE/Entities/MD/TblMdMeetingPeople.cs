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
    [Table("T_MD_MEETINGPEOPLE")]
    public class TblMdMeetingPeolple : BaseEntity
    {
        [Key]
        [Column("ID")]
        public Guid? Id { get; set; }
        [Column("HEADER_ID", TypeName = "NVARCHAR(255)")]
        public Guid? headerID { get; set; }
        [Column("USER_NAME", TypeName = "NVARCHAR(255)")]
        public string? userName { get; set; }
        [Column("FULL_NAME")]

        public string? Fullname { get; set; }
        [Column("DEVICE")]
        public string? Device { get; set; }
        
        [Column("SEAT")]
        public int Seat { get; set; }
        [Column("ROLE_MEETING")]
        public string? RoleMeeting { get; set; }
    }
}
