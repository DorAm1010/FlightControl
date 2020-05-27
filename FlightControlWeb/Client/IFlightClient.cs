using FlightControlWeb.Model;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.Client
{
    interface IFlightClient
    {
        IEnumerable<Flight> Get(DateTime dateTime);
    }
}
