﻿using DMS.CORE.Common;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_DEVICE")]
    public class TblMdDevice : BaseEntity
    {
        [Key]
        [Column("CODE")]
        public string Code { get; set; }

        [Column("NAME")]
        public string Name { get; set; }

        [Column("NOTE")]
        public string? Note { get; set; }
        [Column("DEVICE_TYPE")]
        public string? DeviceType { get; set; }

    }
}
