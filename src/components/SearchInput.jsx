import { useContext, useState } from 'react';
import './save.css'
import { AuthContext } from '../Providers/AuthProvider';
import useAxios from '../Hook/useAxios';
import { useQuery } from '@tanstack/react-query';
const SearchInput = () => {
    function myFunction() {
        refetch()
    }

    const { user } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const myAxios = useAxios();
    const { data: allUsers = [], refetch } = useQuery({
        queryKey: ['filters', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res?.data?.filter(us => us.email != user?.email)
            return findUser;
        },
    })
    // console.log(allUsers.length);

    function filterFunction() {
        var input, filter, ul, li, a, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        let div = document.getElementById("myDropdown");
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            let txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }


    return (
        <div>
            <div className="dropdown w-full">
                <button onClick={()=>myFunction()} className="dropbtn w-full"> <input className='w-full' type="text" placeholder="Search.." id="myInput" onKeyUp={filterFunction} /></button>
                <div id="myDropdown" className="dropdown-content">
                    
                   {
                    user ? allUsers.map(users => <a key={users._id} href={`/details/${users._id}`}><p className='flex items-center gap-2'><img className='w-10 h-10 rounded-full' src={users?.photoURL} alt="" />{users?.name}</p></a>)
                    :
                    allUsers.map(users => <a key={users._id}><p className='flex items-center gap-2'><img className='w-10 h-10 rounded-full' src={users?.photoURL} alt="" />{users?.name}</p></a>)
                   }
                </div>
            </div>
        </div>
    );
};

export default SearchInput;