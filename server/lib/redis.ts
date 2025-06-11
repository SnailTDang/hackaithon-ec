import { createClient } from 'redis'

// tạo một client để giao tiếp với Redis
const redisClient = createClient({
    // process.env.REDIS_URL kiểm tra biến môi trường REDIS_URL, nếu không có sẽ dùng redis://localhost:6379 (mặc định Redis chạy trên cổng 6379 của localhost)
    url: process.env.REDIS_URL || 'redis://localhost:6379',
})

// Xử lý các lỗi phát sinh trong quá trình hoạt động
// Redis client có thể gặp lỗi bất kỳ lúc nào trong quá trình chạy, không chỉ khi kết nối.
// redisClient.on('error', callback) giúp theo dõi và xử lý lỗi trong suốt vòng đời của client, ngay cả sau khi kết nối thành công.
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err)
})

// redisClient.connect() khởi động quá trình kết nối đến Redis.
redisClient
    .connect()
    .then(() => {
        // Nếu kết nối thành công, nó hiển thị Subscriber connected to Redis.
        console.log('Subscriber connected to Redis')
    })
    .catch((err) => {
        // Bắt lỗi khi khởi tạo và kết nối Redis
        // Nếu có lỗi xảy ra trong quá trình kết nối (await redisClient.connect()), chương trình sẽ bắt lỗi ngay lập tức, hiển thị thông báo và tránh việc thực thi tiếp.
        console.error('Failed to connect Redis Subscriber:', err)
    })

export default redisClient
