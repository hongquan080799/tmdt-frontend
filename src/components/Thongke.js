import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { Bar } from "react-chartjs-2";
export default function Thongke() {
    const [tk,setTK] = useState([])
    const [lailo, setLailo] = useState([])
    const [data,setData] = useState();
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    //const [options,setOptions] = useState();
    const header = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt') //the token is a variable which holds the token
          }
    }
    useEffect(()=>{
        const myL = tk.filter((value, index) => index <= 10)
        const labels = myL.map(t =>{
            return t.tensp
        })
        //
        const doanhthu = myL.map(t =>{
            return t.doanhthu
        })
        const myData = {
            labels:labels,
            datasets:[{
                label:"Total income",
                backgroundColor: [
                    "#3e95cd",
                    "#8e5ea2",
                    "#3cba9f",
                    "#e8c3b9",
                    "#c45850"
                ],
                data:doanhthu
            }]
        }
        setData(myData)


        
    },[tk])
    const handleStatistic = ()=>{
       if(from != null && to != null){
        axios.get(process.env.REACT_APP_API_URL+`/thongke?from=${from}&to=${to}`,header)
        .then(res => setTK(res.data))
        .catch(err => console.log(err))

        axios.get(process.env.REACT_APP_API_URL+`/lailo?from=${from}&to=${to}`,header)
        .then(res => setLailo(res.data))
        .catch(err => console.log(err))
       }

    }
    const options={
        legend: { display: false },
        title: {
          display: true,
          text: "TOP 10 PRODUCTS MOST SALE"
        }
      }
    const tongDT = ()=>{
        let tong = 0;
        tk?.forEach(t => tong += t.doanhthu)
        return tong
    }
    const tongLL = ()=>{
        let tong = 0;
        lailo?.forEach(t => tong += t.sotien)
        return tong
    }
    return (
        <div style={{maxHeight:'90vh',overflow:'scroll'}}>
            <div className="d-flex justify-content-end">
                <div className="d-flex w-50">
                    <input type="date" className="form-control mb-2 mr-sm-2" placeholder="Jane Doe" onChange={(e)=> setFrom(e.target.value)} />
                    <input type="date" className="form-control mb-2 mr-sm-2" placeholder="Jane Doe" onChange={(e)=> setTo(e.target.value)}/>
                    <button className = "btn btn-info" onClick={handleStatistic}>Submit</button>
                </div>
            </div>
            
            <div style={{width:'70%',marginTop:'8vh',marginLeft:'10vh'}}>
                <h4 className='mb-4'>TOP 10 PRODUCT HAVE THE MOST SALE</h4>
                <Bar data={data} options = {options} />
            </div>
            <div style={{width:'70%',marginTop:'8vh',marginLeft:'10vh'}}>
                <div className="table-responsive">
                <h4>List income of products</h4>
                <table className="table table-bordered mt-3">
                  <thead className="bg-info text-white">
                    <tr>
                      <th scope="col">Product ID</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tk?.map(t =>{
                        return (
                            <tr>
                                <td>{t.masp}</td>
                                <td>{t.tensp}</td>
                                <td>{t.doanhthu.toFixed(2)} $</td>
                            </tr>
                        )
                    })}
                    <tr className="text-white bg-info">
                        <td>Total income</td>
                        <td colSpan="2">{tongDT().toFixed(3)} $</td>
                    </tr>
                  </tbody>
                </table>
                </div>
                
            </div>
            <div style={{width:'70%',marginTop:'8vh', marginBottom:'8vh',marginLeft:'10vh'}}>
                <div className="table-responsive">
                <h4>List profits and loss</h4>
                <table className="table table-bordered mt-3 table-hover">
                  <thead className="bg-info text-white">
                    <tr>
                      <th scope="col">Product ID</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Money</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lailo?.map(t =>{
                        return (
                            <tr>
                                <td>{t.masp}</td>
                                <td>{t.tensp}</td>
                                <td>{t.sotien > 0 ?<p className="badge badge-success">Profit</p> : <p className="badge badge-danger">Loss</p>}</td>
                                <td>{Math.abs(t.sotien).toFixed(2)} $</td>
                            </tr>
                        )
                    })}
                    <tr className="bg-info text-white">
                        <td> Total money</td>
                        <td colSpan="3">{tongLL().toFixed(2)} $</td>
                    </tr>
                  </tbody>
                </table>
                </div>
                
            </div>

        </div>
    )
}
