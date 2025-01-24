using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Common.Entities
{
    public class Notification : BaseEntity
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public RoleType SenderEntityType { get; set; }
        public RoleType ReceiverEntityType { get; set; }
        public int DataId { get; set; }

    }
}
