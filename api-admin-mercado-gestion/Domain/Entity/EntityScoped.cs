using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entity
{
    public abstract class EntityScoped
    {
        public int EntityId { get; set; }
        public Entity Entity { get; set; }
    }
}
