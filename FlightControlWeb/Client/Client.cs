using FlightControlWeb.Model;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.Client
{
    public class Client : IClient
    {
        public IEnumerable<Flight> Get(DateTime dateTime)
        {
            throw new NotImplementedException();
        }
    }
}
