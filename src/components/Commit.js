import React from 'react'
import './Commit.css'
export default function Commit(){
    return(
        <div className='container'>
            <div className='row text-center'>
                <div class="col-12">
                    <h3 className='list-item__header'>CAM KẾT</h3>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4'>
                    <div className='row'>
                        <div className='col-12 commit'>
                             <div className='commit-section'>
                                <i className="fa fa-truck" aria-hidden="true"></i>
                             </div>
                             <div className='commit-text'>
                                <p className='lead'>Giao hàng tận nơi</p>
                                <p>Giao hàng nhanh chóng miễn phí</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4'>
                    <div className='row'>
                        <div className='col-12 commit'>
                            <div className='commit-section'>
                                <i class="fa fa-archive" aria-hidden="true"></i>
                            </div>
                            <div className='commit-text'>
                                <p className='lead'>Sản phẩm</p>
                                <p>Luôn dẫn đầu về mặt chất lượng</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4'>
                    <div className='row'>
                        <div className='col-12 commit'>
                            <div className='commit-section'>
                                <i className="fa fa-phone" aria-hidden="true"></i>
                            </div>
                            <div className='commit-text'>
                                <p className='lead'>Hotline</p>
                                <p>0336781801</p>
                            </div>
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}