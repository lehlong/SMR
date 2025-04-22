using DMS.CORE.Common;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_ROOM")]
    public class TblMdRoom : BaseEntity
    {
        [Key]
        [Column("CODE")]
        public string Code { get; set; }

        [Column("NAME")]
        public string Name { get; set; }

        [Column("ADDRESS")]
        public string? Address { get; set; }

        [Column("NOTE")]
        public string? Note { get; set; }

        [Column("FILE_PATH")]
        public string? FilePath { get; set; }

    }
}
