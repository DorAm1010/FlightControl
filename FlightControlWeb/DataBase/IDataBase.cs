using System.Collections.Generic;

namespace FlightControlWeb.DataBase
{
    public interface IDataBase<K,V>
    {
        IEnumerable<V> GetAllValues();
        IEnumerable<K> GetAllKeys();
        V GetById(K id);
        void Add(V toAdd);
        void DeleteById(K id);
    }
}
