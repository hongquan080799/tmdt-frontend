import emailjs from 'emailjs-com';

export const sendEmail = (myMessage, user)=>{
    var templateParams = {
        to_name:user?.ho + ' '  + user?.ten,
        from_name: 'Chủ tịch Hồng Quân',
        message:myMessage,
        url:'https://scontent.fsgn5-7.fna.fbcdn.net/v/t1.6435-9/79771446_2469549519965437_8172007245870006272_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=pLCmJOHT02EAX9MvKRe&_nc_ht=scontent.fsgn5-7.fna&oh=fc6dd68ebb012af9470ac03ddc02817c&oe=60B45DDC',
        notes: 'Check this out!',
        email:user?.email
    };
     
    emailjs.send('service_c4h4x3s', 'template_iy1y5te', templateParams,'user_eXT3mcACRHWvnrHkCZPaZ')
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
           window.location.replace('/');
        }, function(error) {
           console.log('FAILED...', error);
        });
} 

export const getMessageOrder = (user, order, shipAddress)=>(
      `<div>
                  <h4 className="text-secondary">Thông tin khách hàng</h4>
                    <hr/>
                        <table className="table table-borderless table-cart">
                            <tr>
                                <td>HỌ TÊN</td>
                                <td>${user?.ho + ' ' + user?.ten}</td>
                            </tr>
                            <tr>
                                <td>SỐ ĐIỆN THOẠI</td>
                                <td>${user?.sdt}</td>
                            </tr>
                            <tr>
                                <td>EMAIL</td>
                                <td>${user?.email}</td>
                            </tr>
                            <tr>
                                <td>ĐỊA CHỈ</td>
                                <td>${shipAddress()}</td>
                            </tr>
                        </table>
                    <hr/>
                  <h4>Danh sách đơn hàng đang chờ xác nhận</h4>
                  <table>
                  ${order.map(c=>{
                        return`
                            <tr>
                                <td><img src=${c?.photo} alt="picture" style="width:100px;padding:5px 30px" /></td>
                                <td style="padding:5px 30px">${c?.tensp}</td>
                                <td style="padding:5px 30px">Số lượng : ${c?.soluong}</td>
                                <td style="padding:5px 30px">${c?.gia * c?.soluong - c?.gia * c?.soluong * c?.khuyenmai} $</td>
                            </tr>`
                        }
                    )}
                  </table>
                  <hr/>
              </div>`)