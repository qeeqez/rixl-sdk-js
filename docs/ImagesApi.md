# .ImagesApi

All URIs are relative to *https://api.rixl.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteImagesImageId**](ImagesApi.md#deleteImagesImageId) | **DELETE** /images/{imageId} | Delete image
[**getImages**](ImagesApi.md#getImages) | **GET** /images | List images for a project
[**getImagesImageId**](ImagesApi.md#getImagesImageId) | **GET** /images/{imageId} | Get image
[**postImagesUploadComplete**](ImagesApi.md#postImagesUploadComplete) | **POST** /images/upload/complete | Upload: Mark as complete
[**postImagesUploadInit**](ImagesApi.md#postImagesUploadInit) | **POST** /images/upload/init | Upload: Init


# **deleteImagesImageId**
> void deleteImagesImageId()

delete an image by marking it as deleted

### Example


```typescript
import { createConfiguration, ImagesApi } from '';
import type { ImagesApiDeleteImagesImageIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ImagesApi(configuration);

const request: ImagesApiDeleteImagesImageIdRequest = {
    // Image ID
  imageId: "imageId_example",
};

const data = await apiInstance.deleteImagesImageId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **imageId** | [**string**] | Image ID | defaults to undefined


### Return type

**void**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Image deleted successfully |  -  |
**400** | Invalid project ID or image ID |  -  |
**401** | Unauthorized |  -  |
**403** | Access denied |  -  |
**404** | Image not found |  -  |
**500** | Failed to delete image |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getImages**
> PaginationPaginatedResponseImage getImages()

Retrieve all images for a specific project, with pagination and sorting.

### Example


```typescript
import { createConfiguration, ImagesApi } from '';
import type { ImagesApiGetImagesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ImagesApi(configuration);

const request: ImagesApiGetImagesRequest = {
    // Maximum number of items to return in a single request. <br> **Default:** `25` (optional)
  limit: 25,
    // Starting point of the result set. <br>To get page 2 with a limit of 25, set `offset` to `25`. <br> **Default:** `0` (optional)
  offset: 0,
    // Field to sort by (created_at, name, size, updated_at) (optional)
  sort: "sort_example",
    // Sort order (asc, desc) (optional)
  order: "order_example",
};

const data = await apiInstance.getImages(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | [**number**] | Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60; | (optional) defaults to 25
 **offset** | [**number**] | Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60; | (optional) defaults to 0
 **sort** | [**string**] | Field to sort by (created_at, name, size, updated_at) | (optional) defaults to undefined
 **order** | [**string**] | Sort order (asc, desc) | (optional) defaults to undefined


### Return type

**PaginationPaginatedResponseImage**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid query parameters |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getImagesImageId**
> Image getImagesImageId()

Retrieve an image by its ID for a specific project.

### Example


```typescript
import { createConfiguration, ImagesApi } from '';
import type { ImagesApiGetImagesImageIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ImagesApi(configuration);

const request: ImagesApiGetImagesImageIdRequest = {
    // Image ID
  imageId: "imageId_example",
};

const data = await apiInstance.getImagesImageId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **imageId** | [**string**] | Image ID | defaults to undefined


### Return type

**Image**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid image ID |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Image not found |  -  |
**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postImagesUploadComplete**
> Image postImagesUploadComplete(request)

Complete the upload process and create the image record using API key authentication

### Example


```typescript
import { createConfiguration, ImagesApi } from '';
import type { ImagesApiPostImagesUploadCompleteRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ImagesApi(configuration);

const request: ImagesApiPostImagesUploadCompleteRequest = {
    // Upload completion request
  request: {
    attached_to_video: false,
    image_id: "PS5IMKoFLm",
  },
};

const data = await apiInstance.postImagesUploadComplete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **request** | **InternalImagesHandlerCompleteRequest**| Upload completion request |


### Return type

**Image**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid request body |  -  |
**401** | Unauthorized - Invalid API key |  -  |
**403** | Access denied |  -  |
**404** | File not found |  -  |
**500** | Failed to complete upload or create image |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postImagesUploadInit**
> InternalImagesHandlerInitResponse postImagesUploadInit(request)

Initialize a presigned URL upload for an image file using API key authentication

### Example


```typescript
import { createConfiguration, ImagesApi } from '';
import type { ImagesApiPostImagesUploadInitRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ImagesApi(configuration);

const request: ImagesApiPostImagesUploadInitRequest = {
    // Upload initialization request
  request: {
    format: "jpg",
    name: "my-image.jpg",
  },
};

const data = await apiInstance.postImagesUploadInit(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **request** | **InternalImagesHandlerUploadInitRequest**| Upload initialization request |


### Return type

**InternalImagesHandlerInitResponse**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid request body |  -  |
**401** | Unauthorized - Invalid API key |  -  |
**403** | Access denied |  -  |
**500** | Failed to initialize upload |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


