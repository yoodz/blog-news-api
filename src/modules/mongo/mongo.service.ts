import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
    private client: MongoClient;
    private db: Db;

    constructor(private readonly uri: string, private readonly dbName: string) { }

    // 初始化时连接数据库
    async onModuleInit() {
        try {
            console.log(this.uri, 'mongo.service-14')
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connected successfully to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
        }
    }

    // 关闭连接
    async onModuleDestroy() {
        try {
            await this.client.close();
            console.log('Connection to MongoDB closed');
        } catch (error) {
            console.error('Failed to close connection to MongoDB', error);
        }
    }

    // 获取数据库实例
    getDB(): Db {
        return this.db;
    }

    // 插入文档
    async insert(collectionName: string, document: any) {
        const collection = this.db.collection(collectionName);
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
        return result;
    }

    // 新增：没有就插入，有就更新
    async insertOrUpdate(collectionName: string, filter: any, update: any) {
        const collection = this.db.collection(collectionName);
        const options = { upsert: true }; // 设置 upsert 选项为 true

        // 使用 $set 来指定要更新的字段
        const result = await collection.updateOne(filter, { $set: update }, options);

        if (result.upsertedCount > 0) {
            console.log(`Inserted new document with _id: ${result.upsertedId}`);
        } else if (result.modifiedCount > 0) {
            console.log(`Updated existing document`);
        } else {
            console.log(`No changes were made`);
        }

        return result;
    }

    // 插入文档
    async insertMany(collectionName: string, document: any) {
        const collection = this.db.collection(collectionName);
        const result = await collection.insertMany(document);
        console.log(`Inserted document count: ${result.insertedCount}`);
        return result;
    }

    // 查询文档
    async find(collectionName: string, query: any = {}) {
        const collection = this.db.collection(collectionName);
        const documents = await collection.find(query).toArray();
        console.log(`Found ${collectionName} ${JSON.stringify(query)} ${documents.length} documents`);
        return documents;
    }

    // 更新文档
    async update(collectionName: string, query: any, update: any) {
        const collection = this.db.collection(collectionName);
        const result = await collection.updateMany(query, { $set: update });
        console.log(`Updated ${result.modifiedCount} documents`);
        return result;
    }

    // 删除文档
    async delete(collectionName: string, query: any) {
        const collection = this.db.collection(collectionName);
        const result = await collection.deleteMany(query);
        console.log(`Deleted ${result.deletedCount} documents`);
        return result;
    }
}