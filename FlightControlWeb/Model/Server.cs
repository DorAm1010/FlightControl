namespace FlightControlWeb.Model
{
    public class Server
    {
        public Server() { }

        public Server(string id, string url)
        {
            Id = id;
            Url = url;
        }

        public string Id { get; set; }
        public string Url { get; set; }
    }
}
