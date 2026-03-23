# .FeedsApi

All URIs are relative to *https://api.rixl.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getFeedsFeedId**](FeedsApi.md#getFeedsFeedId) | **GET** /feeds/{feedId} | List posts in a feed
[**getFeedsFeedIdCreatorsCreatorId**](FeedsApi.md#getFeedsFeedIdCreatorsCreatorId) | **GET** /feeds/{feedId}/creators/{creatorId} | List posts by creator
[**getFeedsFeedIdPostId**](FeedsApi.md#getFeedsFeedIdPostId) | **GET** /feeds/{feedId}/{postId} | Get a post


# **getFeedsFeedId**
> PaginationPaginatedResponsePost getFeedsFeedId()

Retrieve posts in a feed, with pagination.

### Example


```typescript
import { createConfiguration, FeedsApi } from '';
import type { FeedsApiGetFeedsFeedIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new FeedsApi(configuration);

const request: FeedsApiGetFeedsFeedIdRequest = {
    // Feed ID
  feedId: "feedId_example",
    // Maximum number of items to return in a single request. <br> **Default:** `25` (optional)
  limit: 25,
    // Starting point of the result set. <br>To get page 2 with a limit of 25, set `offset` to `25`. <br> **Default:** `0` (optional)
  offset: 0,
};

const data = await apiInstance.getFeedsFeedId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedId** | [**string**] | Feed ID | defaults to undefined
 **limit** | [**number**] | Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60; | (optional) defaults to 25
 **offset** | [**number**] | Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60; | (optional) defaults to 0


### Return type

**PaginationPaginatedResponsePost**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid feed ID or query parameters |  -  |
**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getFeedsFeedIdCreatorsCreatorId**
> PaginationPaginatedResponsePost getFeedsFeedIdCreatorsCreatorId()

Retrieve posts in a feed by a specific creator, with pagination.

### Example


```typescript
import { createConfiguration, FeedsApi } from '';
import type { FeedsApiGetFeedsFeedIdCreatorsCreatorIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new FeedsApi(configuration);

const request: FeedsApiGetFeedsFeedIdCreatorsCreatorIdRequest = {
    // Feed ID
  feedId: "feedId_example",
    // Creator ID
  creatorId: "creatorId_example",
    // Maximum number of items to return in a single request. <br> **Default:** `25` (optional)
  limit: 25,
    // Starting point of the result set. <br>To get page 2 with a limit of 25, set `offset` to `25`. <br> **Default:** `0` (optional)
  offset: 0,
};

const data = await apiInstance.getFeedsFeedIdCreatorsCreatorId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedId** | [**string**] | Feed ID | defaults to undefined
 **creatorId** | [**string**] | Creator ID | defaults to undefined
 **limit** | [**number**] | Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60; | (optional) defaults to 25
 **offset** | [**number**] | Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60; | (optional) defaults to 0


### Return type

**PaginationPaginatedResponsePost**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid feed ID, creator ID, or query parameters |  -  |
**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getFeedsFeedIdPostId**
> Post getFeedsFeedIdPostId()

Retrieve a post from feed by its ID

### Example


```typescript
import { createConfiguration, FeedsApi } from '';
import type { FeedsApiGetFeedsFeedIdPostIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new FeedsApi(configuration);

const request: FeedsApiGetFeedsFeedIdPostIdRequest = {
    // Feed ID
  feedId: "feedId_example",
    // Post ID
  postId: "postId_example",
};

const data = await apiInstance.getFeedsFeedIdPostId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **feedId** | [**string**] | Feed ID | defaults to undefined
 **postId** | [**string**] | Post ID | defaults to undefined


### Return type

**Post**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


