- https://github.com/grafana/k6.git

Đã bao giờ bạn code 1 API mà khi dùng postman tạo request thì thấy cũng có response. Tuy nhiên, sau khi đưa vào sử dụng thì ngày nào cũng thấy bị log lỗi do request gửi vào liên tục, dẫn đến tình trạng cao tải, thành ra tính năng thì có, nhưng gần như không dùng được chưa?

Nếu câu trả lời là rồi, thì hãy cùng mình tìm hiểu qua về performance testing nhé!

# Performance và Load Testing

Performance testing - kiểm thử hiệu năng là quá trình đánh giá chất lượng và khả năng đáp ứng của sản phẩm (hay cụ thể hơn là phần mềm của team). Có nhiều loại kiểm thử hiệu năng có thể được áp dụng trong quá trình kiểm thử phần mềm, load testing - kiểm thử tải trọng là một trong số đó. Nó giúp chúng ta đánh giá được “phản ứng” và trạng thái của phần mềm trong điều kiện thường lẫn cao tải. Từ đó, team dev có thể đánh giá và tránh được các rủi ro khi hệ thống vận hành.

Hiện tại có rất nhiều công cụ hỗ trợ kiểm thử hiệu năng như Jmeter, Grinder, LoadComplete,... Trong bài viết này, chúng ta sẽ cùng nhau tìm hiểu về k6, công cụ mà mình được sếp khai sáng

# k6 là gì

k6 là một công cụ nguồn mở và hoàn toàn miễn phí, giúp việc kiểm thử hiệu năng của các API, microservice, và các website trở nên dễ dàng hơn.

# Cài đặt k6
Mọi người có thể tham khảo cách cài đặt k6 tại đây
- https://github.com/grafana/k6.git

```
docker-compose up -d influxdb grafana

```

Truy cập vào Grafana server http://localhost:3000


# HTTP Requests
2 khái niệm cơ bản bạn cần biết khi làm việc với k6 là người dùng ảo (virtual users - VUs) và duration - 1 chuỗi quy định khoảng thời gian quá trình kiểm thử diễn ra.

k6 sử dụng Javascript để chạy test. 1 kịch bản kiểm thử hiệu năng (tối thiểu) cần có 1 default function giúp VUs xác đỉnh điểm đầu vào, tương tự hàm main() ở các ngôn ngữ lập trình.

Code nằm trong default function gọi là VU code, nó sẽ được chạy hết lần này đến lần khác trong quá trình chạy test. Code nằm ngoài default là init code và chỉ được chạy 1 lần duy nhất với mỗi VU

# HTTP GET request
1 file js đơn giản dùng trong kiểm thử với k6 sẽ trông như thế này.

```
import{ sleep } from 'k6';
import http from 'k6/http';

export let options = {
    duration : '15s',
    vus : 50,
};

export default function() {
    http.get('http://test.k6.io/contacts.php');
    sleep(1);
}

```

