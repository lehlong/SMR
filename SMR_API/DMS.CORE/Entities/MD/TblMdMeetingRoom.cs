using DMS.CORE.Common;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_MEETING_ROOM")]
    public class TblMdMeetingRoom : BaseEntity
    {
        [Key]
        [Column("ID")]
        public Guid Id { get; set; }

        [Column("NAME", TypeName = "NVARCHAR(100)")]
        public string Name { get; set; }

        [Column("TYPE", TypeName = "NVARCHAR(100)")]
        public string? Type { get; set; }

        [Column("SIZE")]
        public int? Size { get; set; }

        [Column("FLOOR")]
        public int? Floor { get; set; }

        [Column("URLIMG", TypeName = "NVARCHAR(100)")]
        public string? UrlImg { get; set; }

        [Column("FILE_PATH", TypeName = "NVARCHAR(255)")]
        public string? FilePath { get; set; }
    }
}
