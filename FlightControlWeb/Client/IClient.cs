using FlightControlWeb.Model;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.Client
{
    interface IClient
    {
        IEnumerable<Flight> Get(DateTime dateTime);
    }
}
