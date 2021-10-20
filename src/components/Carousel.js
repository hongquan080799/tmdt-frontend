import React from 'react'
import './Carousel.css'
function Carousel(){
    return (
        <div className="myCarousel">
            <div id="demo" class="carousel slide" data-ride="carousel">
                <ul class="carousel-indicators">
                    <li data-target="#demo" data-slide-to="0" class="active"></li>
                    <li data-target="#demo" data-slide-to="1"></li>
                    <li data-target="#demo" data-slide-to="2"></li>
                </ul>

                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="https://images.fpt.shop/unsafe/fit-in/800x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/5/637610957229278635_F_H1_800x300.png" alt="picture" />
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.fpt.shop/unsafe/fit-in/800x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/6/2/637582307460607861_F-H1_800x300.png" alt="picture" />
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.fpt.shop/unsafe/fit-in/800x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/1/637606956703846203_F_H1_800x300.png" alt="picture" />
                    </div>
                </div>

                <a class="carousel-control-prev" href="#demo" data-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </a>
                <a class="carousel-control-next" href="#demo" data-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </a>

            </div>
            <div className="myCarousel__more">
                <div className="mb-1"> 
                    <img src="https://images.fpt.shop/unsafe/fit-in/385x100/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/5/637610757383610508_F-H2_385x100.png" alt="picture"/>
                </div>
                <div>
                    <img src="https://images.fpt.shop/unsafe/fit-in/385x100/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/6/30/637606874522264391_F-H2_385x100@2x.png"/>
                </div>
                <div className="news">
                    <div className="news__head d-flex justify-content-between">
                        <p className="news__info">
                            Thông tin nổi bật
                        </p>
                        <p className="news__more">
                            Xem tất cả
                        </p>
                    </div>
                    <div className="news__details d-flex">
                        <img src="https://images.fpt.shop/unsafe/fit-in/70x40/filters:quality(90):fill(white)/https://fptshop.com.vn/uploads/images/tin-tuc/125339/Originals/viber_image_2021-07-05_15-45-22-932.png" alt="picture"/>
                        <p className="news__details-title ml-3">
                            Tháng Apple giảm tới 20%
                        </p>
                    </div>
                    <div className="news__details d-flex">
                        <img src="https://images.fpt.shop/unsafe/fit-in/70x40/filters:quality(90):fill(white)/https://fptshop.com.vn/uploads/images/tin-tuc/125339/Originals/2.png" alt="picture"/>
                        <p className="news__details-title ml-3">
                            Oppo A47 tặng voucher 80%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Carousel