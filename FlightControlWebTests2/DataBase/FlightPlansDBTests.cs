using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.IO;
using FlightControlWeb.Model;
using Newtonsoft.Json;
using System.Reflection;

namespace FlightControlWeb.DataBase.Tests
{
    [TestClass()]
    public class FlightPlansDBTests
    {
        [TestMethod()]
        public void GetByIdTest()
        {
            FlightPlansDB plansDB = new FlightPlansDB();
            // get all json flight plans as string
            string jsonPlans = File.ReadAllText("./Mock/MockFlightPlans.json");
            // deserialize them to list
            List<FlightPlan> flightPlans = JsonConvert.DeserializeObject<List<FlightPlan>>(jsonPlans);
            // add them to DB
            foreach (FlightPlan plan in flightPlans)
                plansDB.Add(plan);
            // assert each plan is in the data base
            foreach (FlightPlan plan in flightPlans)
                Assert.IsTrue(plansDB.GetById(plan.HashId()) != null);
        }

        [TestMethod()]
        public void AddTest()
        {
            FlightPlansDB plansDB = new FlightPlansDB();
            // get all json flight plans as string
            string jsonPlans = File.ReadAllText("./Mock./MockFlightPlans.json");
            // deserialize them to list
            List<FlightPlan> flightPlans = JsonConvert.DeserializeObject<List<FlightPlan>>(jsonPlans);
            // add them to DB
            foreach (FlightPlan plan in flightPlans)
                plansDB.Add(plan);

            // get all plans in the DB
            List<FlightPlan> inDataBase = (List<FlightPlan>) plansDB.GetAllValues();
            // inDataBase should contain 1 less because 2 flight plans have identical information
            Assert.IsTrue(inDataBase.Count + 1 == flightPlans.Count);
        }
    }
}