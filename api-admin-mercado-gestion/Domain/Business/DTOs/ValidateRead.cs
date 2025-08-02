using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Business.DTOs
{
    public class ValidateRead
    {
        public bool IsValid { get; set; }
        public string Domain { get; set; }
        public ValidateRead(bool isValid, string domain)
        {
            this.IsValid = isValid;
            this.Domain = domain;
        }
    }
}
