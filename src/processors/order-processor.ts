import { SandboxedJob } from 'bullmq';
import axios from 'axios';
// @Processor('order')
export default async function OrderProcessor(Job: SandboxedJob) {
    const { order } = Job.data;
    await axios.post('http://localhost:3000/app/orders/persist', { ...order });

    console.log(`✅✅✅✅✅-----------Processing order with ID-----------✅✅✅✅:`);
    // 1. Lưu DB

    // 2. Trừ tồn kho

    // 3. Gửi email xác nhận


    //or

    // const queryRunner = dataSource.createQueryRunner();
    // await queryRunner.startTransaction();
    // try {
    //     // Lock row product
    //     const product = await queryRunner.manager.query(
    //         'SELECT * FROM products WHERE id = $1 FOR UPDATE',
    //         [job.data.productId],
    //     );

    //     if (product[0].stock <= 0) {
    //         throw new Error('Out of stock');
    //     }

    //     await queryRunner.manager.query(
    //         'UPDATE products SET stock = stock - 1 WHERE id = $1',
    //         [job.data.productId],
    //     );

    //     await queryRunner.commitTransaction();
    // } catch (err) {
    //     await queryRunner.rollbackTransaction();
    //     throw err;
    // } finally {
    //     await queryRunner.release();
    // }



    return { success: true, order };
}


