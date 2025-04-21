using DMS.CORE.Common;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_DEVICE")]
    public class TblMdDevice : BaseEntity
    {
        [Key]
        [Column("ID")]
        public Guid Id { get; set; }

        [Column("NAME", TypeName = "NVARCHAR(100)")]
        public string Name { get; set; }

        [Column("TYPE", TypeName = "NVARCHAR(100)")]
        public string? Type { get; set; }

       
    }
}
