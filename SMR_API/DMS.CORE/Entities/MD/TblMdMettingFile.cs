using DMS.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_MEETINGFILE")]
    public class TblMdMeetingFile 
    {
        [Key]
        [Column("ID")]
        public Guid? Id { get; set; }
        [Column("HEADER_ID")]
        public string HeaderId { get; set; }
        [Column("FILE_PATH")]
        public string FilePath { get; set; }
        [Column("NAME")]
        public string FileName { get; set; }
        [Column("TYPE")]
        public string Type { get; set; }

    }
}
