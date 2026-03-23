# .VideosApi

All URIs are relative to *https://api.rixl.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteVideosVideoIdAudioTracks**](VideosApi.md#deleteVideosVideoIdAudioTracks) | **DELETE** /videos/{videoId}/audio-tracks | Delete all audio tracks
[**deleteVideosVideoIdAudioTracksLangCode**](VideosApi.md#deleteVideosVideoIdAudioTracksLangCode) | **DELETE** /videos/{videoId}/audio-tracks/{lang_code} | Delete audio track by language
[**deleteVideosVideoIdAudioTracksTrackId**](VideosApi.md#deleteVideosVideoIdAudioTracksTrackId) | **DELETE** /videos/{videoId}/audio-tracks/{trackId} | Delete audio track
[**deleteVideosVideoIdChapters**](VideosApi.md#deleteVideosVideoIdChapters) | **DELETE** /videos/{videoId}/chapters | Delete video chapters
[**deleteVideosVideoIdDelete**](VideosApi.md#deleteVideosVideoIdDelete) | **DELETE** /videos/{videoId}/delete | Delete video
[**deleteVideosVideoIdSubtitles**](VideosApi.md#deleteVideosVideoIdSubtitles) | **DELETE** /videos/{videoId}/subtitles | Delete all subtitles
[**deleteVideosVideoIdSubtitlesLangCode**](VideosApi.md#deleteVideosVideoIdSubtitlesLangCode) | **DELETE** /videos/{videoId}/subtitles/{lang_code} | Delete subtitle by language
[**deleteVideosVideoIdSubtitlesSubtitleId**](VideosApi.md#deleteVideosVideoIdSubtitlesSubtitleId) | **DELETE** /videos/{videoId}/subtitles/{subtitleId} | Delete subtitle
[**getVideos**](VideosApi.md#getVideos) | **GET** /videos | List videos for a project
[**getVideosLanguages**](VideosApi.md#getVideosLanguages) | **GET** /videos/languages | List available subtitle languages
[**getVideosVideoId**](VideosApi.md#getVideosVideoId) | **GET** /videos/{videoId} | Get a video
[**postVideosUploadComplete**](VideosApi.md#postVideosUploadComplete) | **POST** /videos/upload/complete | Upload: Mark as complete
[**postVideosUploadInit**](VideosApi.md#postVideosUploadInit) | **POST** /videos/upload/init | Upload: Init
[**postVideosVideoIdAudioTracks**](VideosApi.md#postVideosVideoIdAudioTracks) | **POST** /videos/{videoId}/audio-tracks | Bulk upsert video audio tracks
[**postVideosVideoIdSubtitles**](VideosApi.md#postVideosVideoIdSubtitles) | **POST** /videos/{videoId}/subtitles | Bulk upsert video subtitles
[**putVideosVideoIdAudioTracksLangCode**](VideosApi.md#putVideosVideoIdAudioTracksLangCode) | **PUT** /videos/{videoId}/audio-tracks/{lang_code} | Upsert video audio track
[**putVideosVideoIdChapters**](VideosApi.md#putVideosVideoIdChapters) | **PUT** /videos/{videoId}/chapters | Update video chapters
[**putVideosVideoIdSubtitlesLangCode**](VideosApi.md#putVideosVideoIdSubtitlesLangCode) | **PUT** /videos/{videoId}/subtitles/{lang_code} | Upsert video subtitle
[**putVideosVideoIdThumbnail**](VideosApi.md#putVideosVideoIdThumbnail) | **PUT** /videos/{videoId}/thumbnail | Update video thumbnail


# **deleteVideosVideoIdAudioTracks**
> AudioTrackDelete deleteVideosVideoIdAudioTracks()

Remove all additional audio tracks from a video using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdAudioTracksRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdAudioTracksRequest = {
    // Video ID
  videoId: "videoId_example",
};

const data = await apiInstance.deleteVideosVideoIdAudioTracks(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined


### Return type

**AudioTrackDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdAudioTracksLangCode**
> AudioTrackDelete deleteVideosVideoIdAudioTracksLangCode()

Remove an audio track for a specific language using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdAudioTracksLangCodeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdAudioTracksLangCodeRequest = {
    // Video ID
  videoId: "videoId_example",
    // Language Code (BCP 47)
  langCode: "lang_code_example",
};

const data = await apiInstance.deleteVideosVideoIdAudioTracksLangCode(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **langCode** | [**string**] | Language Code (BCP 47) | defaults to undefined


### Return type

**AudioTrackDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdAudioTracksTrackId**
> AudioTrackDelete deleteVideosVideoIdAudioTracksTrackId()

Remove an additional audio track from a video using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdAudioTracksTrackIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdAudioTracksTrackIdRequest = {
    // Video ID
  videoId: "videoId_example",
    // Audio Track ID
  trackId: "trackId_example",
};

const data = await apiInstance.deleteVideosVideoIdAudioTracksTrackId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **trackId** | [**string**] | Audio Track ID | defaults to undefined


### Return type

**AudioTrackDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdChapters**
> UpdateChaptersResponse deleteVideosVideoIdChapters()

Remove all chapters from a video using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdChaptersRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdChaptersRequest = {
    // Video ID
  videoId: "videoId_example",
};

const data = await apiInstance.deleteVideosVideoIdChapters(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined


### Return type

**UpdateChaptersResponse**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized - Invalid API key |  -  |
**403** | Access denied |  -  |
**404** | Video not found |  -  |
**500** | Failed to delete chapters |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdDelete**
> void deleteVideosVideoIdDelete()

Delete a video by its ID within a project

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdDeleteRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdDeleteRequest = {
    // Video ID
  videoId: "videoId_example",
};

const data = await apiInstance.deleteVideosVideoIdDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined


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
**204** | Video deleted successfully |  -  |
**400** | Invalid project ID or video ID |  -  |
**401** | Unauthorized |  -  |
**403** | Access denied |  -  |
**404** | Video not found |  -  |
**500** | Failed to delete video |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdSubtitles**
> SubtitleDelete deleteVideosVideoIdSubtitles()

Remove all subtitles from a video using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdSubtitlesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdSubtitlesRequest = {
    // Video ID
  videoId: "videoId_example",
};

const data = await apiInstance.deleteVideosVideoIdSubtitles(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined


### Return type

**SubtitleDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdSubtitlesLangCode**
> SubtitleDelete deleteVideosVideoIdSubtitlesLangCode()

Remove a subtitle for a specific language using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdSubtitlesLangCodeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdSubtitlesLangCodeRequest = {
    // Video ID
  videoId: "videoId_example",
    // Language Code (BCP 47)
  langCode: "lang_code_example",
};

const data = await apiInstance.deleteVideosVideoIdSubtitlesLangCode(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **langCode** | [**string**] | Language Code (BCP 47) | defaults to undefined


### Return type

**SubtitleDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteVideosVideoIdSubtitlesSubtitleId**
> SubtitleDelete deleteVideosVideoIdSubtitlesSubtitleId()

Remove a subtitle from a video using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiDeleteVideosVideoIdSubtitlesSubtitleIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiDeleteVideosVideoIdSubtitlesSubtitleIdRequest = {
    // Video ID
  videoId: "videoId_example",
    // Subtitle ID
  subtitleId: "subtitleId_example",
};

const data = await apiInstance.deleteVideosVideoIdSubtitlesSubtitleId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **subtitleId** | [**string**] | Subtitle ID | defaults to undefined


### Return type

**SubtitleDelete**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getVideos**
> PaginationPaginatedResponseVideo getVideos()

Retrieve all videos for a specific project, with pagination and sorting.

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiGetVideosRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiGetVideosRequest = {
    // Maximum number of items to return in a single request. <br> **Default:** `25` (optional)
  limit: 25,
    // Starting point of the result set. <br>To get page 2 with a limit of 25, set `offset` to `25`. <br> **Default:** `0` (optional)
  offset: 0,
    // Field to sort by (created_at, name, size, updated_at, duration) (optional)
  sort: "sort_example",
    // Sort order (asc, desc) (optional)
  order: "order_example",
};

const data = await apiInstance.getVideos(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | [**number**] | Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60; | (optional) defaults to 25
 **offset** | [**number**] | Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60; | (optional) defaults to 0
 **sort** | [**string**] | Field to sort by (created_at, name, size, updated_at, duration) | (optional) defaults to undefined
 **order** | [**string**] | Sort order (asc, desc) | (optional) defaults to undefined


### Return type

**PaginationPaginatedResponseVideo**

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

# **getVideosLanguages**
> Array<InternalVideosHandlerSubtitlesLanguageResponse> getVideosLanguages()

Get list of supported languages for subtitles

### Example


```typescript
import { createConfiguration, VideosApi } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request = {};

const data = await apiInstance.getVideosLanguages(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<InternalVideosHandlerSubtitlesLanguageResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getVideosVideoId**
> Video getVideosVideoId()

Retrieve a video by its ID for a specific project.

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiGetVideosVideoIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiGetVideosVideoIdRequest = {
    // Video ID
  videoId: "videoId_example",
};

const data = await apiInstance.getVideosVideoId(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined


### Return type

**Video**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid video ID |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Video not found |  -  |
**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postVideosUploadComplete**
> Video postVideosUploadComplete(request)

Mark a video upload as complete after successful upload to storage using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPostVideosUploadCompleteRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPostVideosUploadCompleteRequest = {
    // Video upload completion request
  request: {
    video_id: "VI9VXQxWXQ",
  },
};

const data = await apiInstance.postVideosUploadComplete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **request** | **GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest**| Video upload completion request |


### Return type

**Video**

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
**500** | Failed to complete upload |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postVideosUploadInit**
> GithubComQeeqezApiInternalVideosHandlerUploadInitResponse postVideosUploadInit(request)

Initialize a video upload and get presigned URLs for video and poster using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPostVideosUploadInitRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPostVideosUploadInitRequest = {
    // Video upload initialization request
  request: {
    file_name: "my-video.mp4",
    image_format: "jpg",
    video_quality: ,
  },
};

const data = await apiInstance.postVideosUploadInit(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **request** | **VideoUploadInitRequest**| Video upload initialization request |


### Return type

**GithubComQeeqezApiInternalVideosHandlerUploadInitResponse**

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

# **postVideosVideoIdAudioTracks**
> Array<AudioTrack> postVideosVideoIdAudioTracks()

Replace all audio tracks with the provided ones using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPostVideosVideoIdAudioTracksRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPostVideosVideoIdAudioTracksRequest = {
    // Video ID
  videoId: "videoId_example",
    // Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
  files: [
    { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  ],
    // Comma-separated language codes
  languageCodes: "languageCodes_example",
    // Comma-separated labels
  labels: "labels_example",
};

const data = await apiInstance.postVideosVideoIdAudioTracks(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **files** | **Array&lt;HttpFile&gt;** | Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac) | defaults to undefined
 **languageCodes** | [**string**] | Comma-separated language codes | defaults to undefined
 **labels** | [**string**] | Comma-separated labels | defaults to undefined


### Return type

**Array<AudioTrack>**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postVideosVideoIdSubtitles**
> Array<Subtitle> postVideosVideoIdSubtitles()

Replace all subtitles with the provided ones using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPostVideosVideoIdSubtitlesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPostVideosVideoIdSubtitlesRequest = {
    // Video ID
  videoId: "videoId_example",
    // Subtitle files (.srt or .vtt)
  files: [
    { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  ],
    // Comma-separated language codes
  languageCodes: "languageCodes_example",
    // Comma-separated labels
  labels: "labels_example",
};

const data = await apiInstance.postVideosVideoIdSubtitles(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **files** | **Array&lt;HttpFile&gt;** | Subtitle files (.srt or .vtt) | defaults to undefined
 **languageCodes** | [**string**] | Comma-separated language codes | defaults to undefined
 **labels** | [**string**] | Comma-separated labels | defaults to undefined


### Return type

**Array<Subtitle>**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putVideosVideoIdAudioTracksLangCode**
> AudioTrack putVideosVideoIdAudioTracksLangCode()

Add or replace an audio track for a specific language using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPutVideosVideoIdAudioTracksLangCodeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPutVideosVideoIdAudioTracksLangCodeRequest = {
    // Video ID
  videoId: "videoId_example",
    // Language Code (BCP 47)
  langCode: "lang_code_example",
    // Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
  file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    // Label (e.g. English) (optional)
  label: "label_example",
};

const data = await apiInstance.putVideosVideoIdAudioTracksLangCode(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **langCode** | [**string**] | Language Code (BCP 47) | defaults to undefined
 **file** | [**HttpFile**] | Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac) | defaults to undefined
 **label** | [**string**] | Label (e.g. English) | (optional) defaults to undefined


### Return type

**AudioTrack**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putVideosVideoIdChapters**
> UpdateChaptersResponse putVideosVideoIdChapters(request)

Replace all chapters for a video (atomic PUT operation) using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPutVideosVideoIdChaptersRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPutVideosVideoIdChaptersRequest = {
    // Video ID
  videoId: "videoId_example",
    // Chapters array
  request: {
    chapters: [
      {
        start_time_sec: 3.14,
        title: "title_example",
      },
    ],
  },
};

const data = await apiInstance.putVideosVideoIdChapters(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **request** | **UpdateChaptersRequest**| Chapters array |
 **videoId** | [**string**] | Video ID | defaults to undefined


### Return type

**UpdateChaptersResponse**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Invalid request body or video duration not available |  -  |
**401** | Unauthorized - Invalid API key |  -  |
**403** | Access denied |  -  |
**404** | Video not found |  -  |
**500** | Failed to update chapters |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putVideosVideoIdSubtitlesLangCode**
> Subtitle putVideosVideoIdSubtitlesLangCode()

Add or replace a subtitle for a specific language using API key authentication

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPutVideosVideoIdSubtitlesLangCodeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPutVideosVideoIdSubtitlesLangCodeRequest = {
    // Video ID
  videoId: "videoId_example",
    // Language Code (BCP 47)
  langCode: "lang_code_example",
    // Subtitle file (.srt or .vtt)
  file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    // Label (e.g. English) (optional)
  label: "label_example",
};

const data = await apiInstance.putVideosVideoIdSubtitlesLangCode(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **langCode** | [**string**] | Language Code (BCP 47) | defaults to undefined
 **file** | [**HttpFile**] | Subtitle file (.srt or .vtt) | defaults to undefined
 **label** | [**string**] | Label (e.g. English) | (optional) defaults to undefined


### Return type

**Subtitle**

### Authorization

[ApiKeyAuth](README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putVideosVideoIdThumbnail**
> Video putVideosVideoIdThumbnail()

Update the thumbnail image for an existing video

### Example


```typescript
import { createConfiguration, VideosApi } from '';
import type { VideosApiPutVideosVideoIdThumbnailRequest } from '';

const configuration = createConfiguration();
const apiInstance = new VideosApi(configuration);

const request: VideosApiPutVideosVideoIdThumbnailRequest = {
    // Video ID
  videoId: "videoId_example",
    // Thumbnail image file (max 5MB, image/_*)
  thumbnail: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
};

const data = await apiInstance.putVideosVideoIdThumbnail(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoId** | [**string**] | Video ID | defaults to undefined
 **thumbnail** | [**HttpFile**] | Thumbnail image file (max 5MB, image/_*) | defaults to undefined


### Return type

**Video**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Video with updated thumbnail |  -  |
**400** | Invalid file or request |  -  |
**401** | Unauthorized |  -  |
**403** | Access denied |  -  |
**404** | Video not found |  -  |
**500** | Upload or update failed |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


