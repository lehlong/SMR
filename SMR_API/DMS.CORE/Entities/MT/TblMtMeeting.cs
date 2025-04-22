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
    [Table("T_MT_MEETING")]
    public class TblMtMeeting : BaseEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }

        [Column("NAME")]
        public string Name { get; set; }

        [Column("ROOM_CODE")]
        public string? RoomCode { get; set; }

        [Column("TIME")]
        public DateTime? DeviceType { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("NOTE")]
        public string? Note { get; set; }

    }
}
