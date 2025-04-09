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
    [Table("T_MD_METTING_DETAIL")]
    public class TblMdMettingDetail : SoftDeleteEntity
    {
        [Key]
        [Column("ID")]
        public string Id { get; set; }
        [Column("HEADER_ID")]
        public string HeaderId { get; set; }
        [Column("PERSON_NAME")]
        public string PersonName { get; set; }
    }
}
