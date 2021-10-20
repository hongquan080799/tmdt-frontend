import React from 'react'
import quan from '../image/quan.jpg'
import './About.css'
export default function About(){
    return (

        <div className='myAbout'>
            <div className='container'>
            <div className="row about text-center" id="about">
                <div className="col-12">
                    <h3 className='list-item__header'>GIỚI THIỆU</h3>
                </div>
                <div className="col-12 row about-body">
                    <div className="col-sm-3">
                        <img src={quan} alt="" className="rounded-circle" style={{width: "60%"}} />
                    </div>
                    <div className="col-sm-9 text-left">
                        <i className="fa fa-quote-left" aria-hidden="true"></i> Nghèo không là xấu, nghèo mà không có chí mới là xấu; hèn không đáng ghét,
                        hèn mà không có tài mới đáng ghét; già không nên than thở,
                        già mà sống thừa mới đáng than thở; chết không nên bi ai, 
                        chết mà vô bổ mới đáng bi ai <i className="fa fa-quote-right" aria-hidden="true"></i>
                        <p className="about-name">-- Trần Hồng Quân - Quân đạo lý--</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}