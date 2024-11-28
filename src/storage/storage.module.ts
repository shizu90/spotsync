import { Module, Provider } from '@nestjs/common';
import { FileStorageProvider } from './file-storage';
import { FileStorageServices } from './file-storage-services.enum';
import { LocalFileStorage } from './local.file-storage';


const providers = (service: FileStorageServices): Provider[] => {
    return [
        {
            provide: FileStorageProvider,
            useClass: (
                service == FileStorageServices.LOCAL ? LocalFileStorage :
                service == FileStorageServices.S3 ? LocalFileStorage :
                LocalFileStorage 
            )
        }
    ];
};

@Module({})
export class StorageModule {
    static forService(service: FileStorageServices) {
        return {
            module: StorageModule,
            providers: providers(service),
            exports: providers(service)
        };
    }
}
