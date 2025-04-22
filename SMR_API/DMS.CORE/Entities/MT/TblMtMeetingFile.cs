using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DMS.CORE.Common;

namespace DMS.CORE.Entities.MT
{
    [Table("T_MT_MEETING_FILE")]
    public class TblMtMeetingFile : BaseEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }

        [Column("MEET_ID")]
        public string MeetId { get; set; }

        [Column("FILE_NAME")]
        public string? FileName { get; set; }

        [Column("FILE_TYPE")]
        public string? FileType { get; set; }

        [Column("FILE_PATH")]
        public string? FilePath { get; set; }

    }
}
