import { SandboxedJob } from 'bullmq';
import axios from 'axios';
// @Processor('order')
export default async function OrderProcessor(Job: SandboxedJob) {
    const { order } = Job.data;
    console.log("order: ", order);

    const result = await axios.get('http://localhost:3000/app/orders');
    console.log("result: ", result.data.records.data);
    
    console.log(`✅✅✅✅✅-----------Processing order with ID-----------✅✅✅✅:`);
    // 1. Lưu DB

    // 2. Trừ tồn kho

    // 3. Gửi email xác nhận
    return { success: true, order };
}