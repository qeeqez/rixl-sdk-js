import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { AudioTrack } from '../models/AudioTrack';
import { AudioTrackDelete } from '../models/AudioTrackDelete';
import { Chapter } from '../models/Chapter';
import { FileStatus } from '../models/FileStatus';
import { GithubComQeeqezApiDbSqlcPlanType } from '../models/GithubComQeeqezApiDbSqlcPlanType';
import { GithubComQeeqezApiDbSqlcVideoQuality } from '../models/GithubComQeeqezApiDbSqlcVideoQuality';
import { GithubComQeeqezApiInternalErrorsErrorResponse } from '../models/GithubComQeeqezApiInternalErrorsErrorResponse';
import { GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest } from '../models/GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest';
import { GithubComQeeqezApiInternalVideosHandlerUploadInitResponse } from '../models/GithubComQeeqezApiInternalVideosHandlerUploadInitResponse';
import { GithubComQeeqezApiInternalVideosTypesChapterInput } from '../models/GithubComQeeqezApiInternalVideosTypesChapterInput';
import { GithubComQeeqezApiInternalVideosVideoResponse } from '../models/GithubComQeeqezApiInternalVideosVideoResponse';
import { Image } from '../models/Image';
import { InternalImagesHandlerCompleteRequest } from '../models/InternalImagesHandlerCompleteRequest';
import { InternalImagesHandlerInitResponse } from '../models/InternalImagesHandlerInitResponse';
import { InternalImagesHandlerUploadInitRequest } from '../models/InternalImagesHandlerUploadInitRequest';
import { InternalVideosHandlerSubtitlesLanguageResponse } from '../models/InternalVideosHandlerSubtitlesLanguageResponse';
import { ModelFile } from '../models/ModelFile';
import { PaginationPaginatedResponseImage } from '../models/PaginationPaginatedResponseImage';
import { PaginationPaginatedResponsePost } from '../models/PaginationPaginatedResponsePost';
import { PaginationPaginatedResponseVideo } from '../models/PaginationPaginatedResponseVideo';
import { PaginationPagination } from '../models/PaginationPagination';
import { Post } from '../models/Post';
import { PostType } from '../models/PostType';
import { Subtitle } from '../models/Subtitle';
import { SubtitleDelete } from '../models/SubtitleDelete';
import { UpdateChaptersRequest } from '../models/UpdateChaptersRequest';
import { UpdateChaptersResponse } from '../models/UpdateChaptersResponse';
import { Video } from '../models/Video';
import { VideoUploadInitRequest } from '../models/VideoUploadInitRequest';

import { ObservableFeedsApi } from "./ObservableAPI";
import { FeedsApiRequestFactory, FeedsApiResponseProcessor} from "../apis/FeedsApi";

export interface FeedsApiGetFeedsFeedIdRequest {
    /**
     * Feed ID
     * Defaults to: undefined
     * @type string
     * @memberof FeedsApigetFeedsFeedId
     */
    feedId: string
    /**
     * Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * Minimum: 1
     * Maximum: 100
     * Defaults to: 25
     * @type number
     * @memberof FeedsApigetFeedsFeedId
     */
    limit?: number
    /**
     * Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * Minimum: 0
     * Defaults to: 0
     * @type number
     * @memberof FeedsApigetFeedsFeedId
     */
    offset?: number
}

export interface FeedsApiGetFeedsFeedIdCreatorsCreatorIdRequest {
    /**
     * Feed ID
     * Defaults to: undefined
     * @type string
     * @memberof FeedsApigetFeedsFeedIdCreatorsCreatorId
     */
    feedId: string
    /**
     * Creator ID
     * Defaults to: undefined
     * @type string
     * @memberof FeedsApigetFeedsFeedIdCreatorsCreatorId
     */
    creatorId: string
    /**
     * Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * Minimum: 1
     * Maximum: 100
     * Defaults to: 25
     * @type number
     * @memberof FeedsApigetFeedsFeedIdCreatorsCreatorId
     */
    limit?: number
    /**
     * Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * Minimum: 0
     * Defaults to: 0
     * @type number
     * @memberof FeedsApigetFeedsFeedIdCreatorsCreatorId
     */
    offset?: number
}

export interface FeedsApiGetFeedsFeedIdPostIdRequest {
    /**
     * Feed ID
     * Defaults to: undefined
     * @type string
     * @memberof FeedsApigetFeedsFeedIdPostId
     */
    feedId: string
    /**
     * Post ID
     * Defaults to: undefined
     * @type string
     * @memberof FeedsApigetFeedsFeedIdPostId
     */
    postId: string
}

export class ObjectFeedsApi {
    private api: ObservableFeedsApi

    public constructor(configuration: Configuration, requestFactory?: FeedsApiRequestFactory, responseProcessor?: FeedsApiResponseProcessor) {
        this.api = new ObservableFeedsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param param the request object
     */
    public getFeedsFeedIdWithHttpInfo(param: FeedsApiGetFeedsFeedIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponsePost>> {
        return this.api.getFeedsFeedIdWithHttpInfo(param.feedId, param.limit, param.offset,  options).toPromise();
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param param the request object
     */
    public getFeedsFeedId(param: FeedsApiGetFeedsFeedIdRequest, options?: ConfigurationOptions): Promise<PaginationPaginatedResponsePost> {
        return this.api.getFeedsFeedId(param.feedId, param.limit, param.offset,  options).toPromise();
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param param the request object
     */
    public getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(param: FeedsApiGetFeedsFeedIdCreatorsCreatorIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponsePost>> {
        return this.api.getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(param.feedId, param.creatorId, param.limit, param.offset,  options).toPromise();
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param param the request object
     */
    public getFeedsFeedIdCreatorsCreatorId(param: FeedsApiGetFeedsFeedIdCreatorsCreatorIdRequest, options?: ConfigurationOptions): Promise<PaginationPaginatedResponsePost> {
        return this.api.getFeedsFeedIdCreatorsCreatorId(param.feedId, param.creatorId, param.limit, param.offset,  options).toPromise();
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param param the request object
     */
    public getFeedsFeedIdPostIdWithHttpInfo(param: FeedsApiGetFeedsFeedIdPostIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Post>> {
        return this.api.getFeedsFeedIdPostIdWithHttpInfo(param.feedId, param.postId,  options).toPromise();
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param param the request object
     */
    public getFeedsFeedIdPostId(param: FeedsApiGetFeedsFeedIdPostIdRequest, options?: ConfigurationOptions): Promise<Post> {
        return this.api.getFeedsFeedIdPostId(param.feedId, param.postId,  options).toPromise();
    }

}

import { ObservableImagesApi } from "./ObservableAPI";
import { ImagesApiRequestFactory, ImagesApiResponseProcessor} from "../apis/ImagesApi";

export interface ImagesApiDeleteImagesImageIdRequest {
    /**
     * Image ID
     * Defaults to: undefined
     * @type string
     * @memberof ImagesApideleteImagesImageId
     */
    imageId: string
}

export interface ImagesApiGetImagesRequest {
    /**
     * Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * Minimum: 1
     * Maximum: 100
     * Defaults to: 25
     * @type number
     * @memberof ImagesApigetImages
     */
    limit?: number
    /**
     * Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * Minimum: 0
     * Defaults to: 0
     * @type number
     * @memberof ImagesApigetImages
     */
    offset?: number
    /**
     * Field to sort by (created_at, name, size, updated_at)
     * Defaults to: undefined
     * @type string
     * @memberof ImagesApigetImages
     */
    sort?: string
    /**
     * Sort order (asc, desc)
     * Defaults to: undefined
     * @type string
     * @memberof ImagesApigetImages
     */
    order?: string
}

export interface ImagesApiGetImagesImageIdRequest {
    /**
     * Image ID
     * Defaults to: undefined
     * @type string
     * @memberof ImagesApigetImagesImageId
     */
    imageId: string
}

export interface ImagesApiPostImagesUploadCompleteRequest {
    /**
     * Upload completion request
     * @type InternalImagesHandlerCompleteRequest
     * @memberof ImagesApipostImagesUploadComplete
     */
    request: InternalImagesHandlerCompleteRequest
}

export interface ImagesApiPostImagesUploadInitRequest {
    /**
     * Upload initialization request
     * @type InternalImagesHandlerUploadInitRequest
     * @memberof ImagesApipostImagesUploadInit
     */
    request: InternalImagesHandlerUploadInitRequest
}

export class ObjectImagesApi {
    private api: ObservableImagesApi

    public constructor(configuration: Configuration, requestFactory?: ImagesApiRequestFactory, responseProcessor?: ImagesApiResponseProcessor) {
        this.api = new ObservableImagesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param param the request object
     */
    public deleteImagesImageIdWithHttpInfo(param: ImagesApiDeleteImagesImageIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteImagesImageIdWithHttpInfo(param.imageId,  options).toPromise();
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param param the request object
     */
    public deleteImagesImageId(param: ImagesApiDeleteImagesImageIdRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteImagesImageId(param.imageId,  options).toPromise();
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param param the request object
     */
    public getImagesWithHttpInfo(param: ImagesApiGetImagesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponseImage>> {
        return this.api.getImagesWithHttpInfo(param.limit, param.offset, param.sort, param.order,  options).toPromise();
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param param the request object
     */
    public getImages(param: ImagesApiGetImagesRequest = {}, options?: ConfigurationOptions): Promise<PaginationPaginatedResponseImage> {
        return this.api.getImages(param.limit, param.offset, param.sort, param.order,  options).toPromise();
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param param the request object
     */
    public getImagesImageIdWithHttpInfo(param: ImagesApiGetImagesImageIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Image>> {
        return this.api.getImagesImageIdWithHttpInfo(param.imageId,  options).toPromise();
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param param the request object
     */
    public getImagesImageId(param: ImagesApiGetImagesImageIdRequest, options?: ConfigurationOptions): Promise<Image> {
        return this.api.getImagesImageId(param.imageId,  options).toPromise();
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param param the request object
     */
    public postImagesUploadCompleteWithHttpInfo(param: ImagesApiPostImagesUploadCompleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<Image>> {
        return this.api.postImagesUploadCompleteWithHttpInfo(param.request,  options).toPromise();
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param param the request object
     */
    public postImagesUploadComplete(param: ImagesApiPostImagesUploadCompleteRequest, options?: ConfigurationOptions): Promise<Image> {
        return this.api.postImagesUploadComplete(param.request,  options).toPromise();
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param param the request object
     */
    public postImagesUploadInitWithHttpInfo(param: ImagesApiPostImagesUploadInitRequest, options?: ConfigurationOptions): Promise<HttpInfo<InternalImagesHandlerInitResponse>> {
        return this.api.postImagesUploadInitWithHttpInfo(param.request,  options).toPromise();
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param param the request object
     */
    public postImagesUploadInit(param: ImagesApiPostImagesUploadInitRequest, options?: ConfigurationOptions): Promise<InternalImagesHandlerInitResponse> {
        return this.api.postImagesUploadInit(param.request,  options).toPromise();
    }

}

import { ObservableVideosApi } from "./ObservableAPI";
import { VideosApiRequestFactory, VideosApiResponseProcessor} from "../apis/VideosApi";

export interface VideosApiDeleteVideosVideoIdAudioTracksRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdAudioTracks
     */
    videoId: string
}

export interface VideosApiDeleteVideosVideoIdAudioTracksLangCodeRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdAudioTracksLangCode
     */
    videoId: string
    /**
     * Language Code (BCP 47)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdAudioTracksLangCode
     */
    langCode: string
}

export interface VideosApiDeleteVideosVideoIdAudioTracksTrackIdRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdAudioTracksTrackId
     */
    videoId: string
    /**
     * Audio Track ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdAudioTracksTrackId
     */
    trackId: string
}

export interface VideosApiDeleteVideosVideoIdChaptersRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdChapters
     */
    videoId: string
}

export interface VideosApiDeleteVideosVideoIdDeleteRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdDelete
     */
    videoId: string
}

export interface VideosApiDeleteVideosVideoIdSubtitlesRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdSubtitles
     */
    videoId: string
}

export interface VideosApiDeleteVideosVideoIdSubtitlesLangCodeRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdSubtitlesLangCode
     */
    videoId: string
    /**
     * Language Code (BCP 47)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdSubtitlesLangCode
     */
    langCode: string
}

export interface VideosApiDeleteVideosVideoIdSubtitlesSubtitleIdRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdSubtitlesSubtitleId
     */
    videoId: string
    /**
     * Subtitle ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApideleteVideosVideoIdSubtitlesSubtitleId
     */
    subtitleId: string
}

export interface VideosApiGetVideosRequest {
    /**
     * Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * Minimum: 1
     * Maximum: 100
     * Defaults to: 25
     * @type number
     * @memberof VideosApigetVideos
     */
    limit?: number
    /**
     * Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * Minimum: 0
     * Defaults to: 0
     * @type number
     * @memberof VideosApigetVideos
     */
    offset?: number
    /**
     * Field to sort by (created_at, name, size, updated_at, duration)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApigetVideos
     */
    sort?: string
    /**
     * Sort order (asc, desc)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApigetVideos
     */
    order?: string
}

export interface VideosApiGetVideosLanguagesRequest {
}

export interface VideosApiGetVideosVideoIdRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApigetVideosVideoId
     */
    videoId: string
}

export interface VideosApiPostVideosUploadCompleteRequest {
    /**
     * Video upload completion request
     * @type GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest
     * @memberof VideosApipostVideosUploadComplete
     */
    request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest
}

export interface VideosApiPostVideosUploadInitRequest {
    /**
     * Video upload initialization request
     * @type VideoUploadInitRequest
     * @memberof VideosApipostVideosUploadInit
     */
    request: VideoUploadInitRequest
}

export interface VideosApiPostVideosVideoIdAudioTracksRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdAudioTracks
     */
    videoId: string
    /**
     * Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * Defaults to: undefined
     * @type Array&lt;HttpFile&gt;
     * @memberof VideosApipostVideosVideoIdAudioTracks
     */
    files: Array<HttpFile>
    /**
     * Comma-separated language codes
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdAudioTracks
     */
    languageCodes: string
    /**
     * Comma-separated labels
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdAudioTracks
     */
    labels: string
}

export interface VideosApiPostVideosVideoIdSubtitlesRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdSubtitles
     */
    videoId: string
    /**
     * Subtitle files (.srt or .vtt)
     * Defaults to: undefined
     * @type Array&lt;HttpFile&gt;
     * @memberof VideosApipostVideosVideoIdSubtitles
     */
    files: Array<HttpFile>
    /**
     * Comma-separated language codes
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdSubtitles
     */
    languageCodes: string
    /**
     * Comma-separated labels
     * Defaults to: undefined
     * @type string
     * @memberof VideosApipostVideosVideoIdSubtitles
     */
    labels: string
}

export interface VideosApiPutVideosVideoIdAudioTracksLangCodeRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdAudioTracksLangCode
     */
    videoId: string
    /**
     * Language Code (BCP 47)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdAudioTracksLangCode
     */
    langCode: string
    /**
     * Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * Defaults to: undefined
     * @type HttpFile
     * @memberof VideosApiputVideosVideoIdAudioTracksLangCode
     */
    file: HttpFile
    /**
     * Label (e.g. English)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdAudioTracksLangCode
     */
    label?: string
}

export interface VideosApiPutVideosVideoIdChaptersRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdChapters
     */
    videoId: string
    /**
     * Chapters array
     * @type UpdateChaptersRequest
     * @memberof VideosApiputVideosVideoIdChapters
     */
    request: UpdateChaptersRequest
}

export interface VideosApiPutVideosVideoIdSubtitlesLangCodeRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdSubtitlesLangCode
     */
    videoId: string
    /**
     * Language Code (BCP 47)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdSubtitlesLangCode
     */
    langCode: string
    /**
     * Subtitle file (.srt or .vtt)
     * Defaults to: undefined
     * @type HttpFile
     * @memberof VideosApiputVideosVideoIdSubtitlesLangCode
     */
    file: HttpFile
    /**
     * Label (e.g. English)
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdSubtitlesLangCode
     */
    label?: string
}

export interface VideosApiPutVideosVideoIdThumbnailRequest {
    /**
     * Video ID
     * Defaults to: undefined
     * @type string
     * @memberof VideosApiputVideosVideoIdThumbnail
     */
    videoId: string
    /**
     * Thumbnail image file (max 5MB, image/_*)
     * Defaults to: undefined
     * @type HttpFile
     * @memberof VideosApiputVideosVideoIdThumbnail
     */
    thumbnail: HttpFile
}

export class ObjectVideosApi {
    private api: ObservableVideosApi

    public constructor(configuration: Configuration, requestFactory?: VideosApiRequestFactory, responseProcessor?: VideosApiResponseProcessor) {
        this.api = new ObservableVideosApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracksWithHttpInfo(param: VideosApiDeleteVideosVideoIdAudioTracksRequest, options?: ConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        return this.api.deleteVideosVideoIdAudioTracksWithHttpInfo(param.videoId,  options).toPromise();
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracks(param: VideosApiDeleteVideosVideoIdAudioTracksRequest, options?: ConfigurationOptions): Promise<AudioTrackDelete> {
        return this.api.deleteVideosVideoIdAudioTracks(param.videoId,  options).toPromise();
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(param: VideosApiDeleteVideosVideoIdAudioTracksLangCodeRequest, options?: ConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        return this.api.deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(param.videoId, param.langCode,  options).toPromise();
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracksLangCode(param: VideosApiDeleteVideosVideoIdAudioTracksLangCodeRequest, options?: ConfigurationOptions): Promise<AudioTrackDelete> {
        return this.api.deleteVideosVideoIdAudioTracksLangCode(param.videoId, param.langCode,  options).toPromise();
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(param: VideosApiDeleteVideosVideoIdAudioTracksTrackIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        return this.api.deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(param.videoId, param.trackId,  options).toPromise();
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param param the request object
     */
    public deleteVideosVideoIdAudioTracksTrackId(param: VideosApiDeleteVideosVideoIdAudioTracksTrackIdRequest, options?: ConfigurationOptions): Promise<AudioTrackDelete> {
        return this.api.deleteVideosVideoIdAudioTracksTrackId(param.videoId, param.trackId,  options).toPromise();
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param param the request object
     */
    public deleteVideosVideoIdChaptersWithHttpInfo(param: VideosApiDeleteVideosVideoIdChaptersRequest, options?: ConfigurationOptions): Promise<HttpInfo<UpdateChaptersResponse>> {
        return this.api.deleteVideosVideoIdChaptersWithHttpInfo(param.videoId,  options).toPromise();
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param param the request object
     */
    public deleteVideosVideoIdChapters(param: VideosApiDeleteVideosVideoIdChaptersRequest, options?: ConfigurationOptions): Promise<UpdateChaptersResponse> {
        return this.api.deleteVideosVideoIdChapters(param.videoId,  options).toPromise();
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param param the request object
     */
    public deleteVideosVideoIdDeleteWithHttpInfo(param: VideosApiDeleteVideosVideoIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteVideosVideoIdDeleteWithHttpInfo(param.videoId,  options).toPromise();
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param param the request object
     */
    public deleteVideosVideoIdDelete(param: VideosApiDeleteVideosVideoIdDeleteRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteVideosVideoIdDelete(param.videoId,  options).toPromise();
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitlesWithHttpInfo(param: VideosApiDeleteVideosVideoIdSubtitlesRequest, options?: ConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        return this.api.deleteVideosVideoIdSubtitlesWithHttpInfo(param.videoId,  options).toPromise();
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitles(param: VideosApiDeleteVideosVideoIdSubtitlesRequest, options?: ConfigurationOptions): Promise<SubtitleDelete> {
        return this.api.deleteVideosVideoIdSubtitles(param.videoId,  options).toPromise();
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(param: VideosApiDeleteVideosVideoIdSubtitlesLangCodeRequest, options?: ConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        return this.api.deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(param.videoId, param.langCode,  options).toPromise();
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitlesLangCode(param: VideosApiDeleteVideosVideoIdSubtitlesLangCodeRequest, options?: ConfigurationOptions): Promise<SubtitleDelete> {
        return this.api.deleteVideosVideoIdSubtitlesLangCode(param.videoId, param.langCode,  options).toPromise();
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(param: VideosApiDeleteVideosVideoIdSubtitlesSubtitleIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        return this.api.deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(param.videoId, param.subtitleId,  options).toPromise();
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param param the request object
     */
    public deleteVideosVideoIdSubtitlesSubtitleId(param: VideosApiDeleteVideosVideoIdSubtitlesSubtitleIdRequest, options?: ConfigurationOptions): Promise<SubtitleDelete> {
        return this.api.deleteVideosVideoIdSubtitlesSubtitleId(param.videoId, param.subtitleId,  options).toPromise();
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param param the request object
     */
    public getVideosWithHttpInfo(param: VideosApiGetVideosRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponseVideo>> {
        return this.api.getVideosWithHttpInfo(param.limit, param.offset, param.sort, param.order,  options).toPromise();
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param param the request object
     */
    public getVideos(param: VideosApiGetVideosRequest = {}, options?: ConfigurationOptions): Promise<PaginationPaginatedResponseVideo> {
        return this.api.getVideos(param.limit, param.offset, param.sort, param.order,  options).toPromise();
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     * @param param the request object
     */
    public getVideosLanguagesWithHttpInfo(param: VideosApiGetVideosLanguagesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<InternalVideosHandlerSubtitlesLanguageResponse>>> {
        return this.api.getVideosLanguagesWithHttpInfo( options).toPromise();
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     * @param param the request object
     */
    public getVideosLanguages(param: VideosApiGetVideosLanguagesRequest = {}, options?: ConfigurationOptions): Promise<Array<InternalVideosHandlerSubtitlesLanguageResponse>> {
        return this.api.getVideosLanguages( options).toPromise();
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param param the request object
     */
    public getVideosVideoIdWithHttpInfo(param: VideosApiGetVideosVideoIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Video>> {
        return this.api.getVideosVideoIdWithHttpInfo(param.videoId,  options).toPromise();
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param param the request object
     */
    public getVideosVideoId(param: VideosApiGetVideosVideoIdRequest, options?: ConfigurationOptions): Promise<Video> {
        return this.api.getVideosVideoId(param.videoId,  options).toPromise();
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param param the request object
     */
    public postVideosUploadCompleteWithHttpInfo(param: VideosApiPostVideosUploadCompleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<Video>> {
        return this.api.postVideosUploadCompleteWithHttpInfo(param.request,  options).toPromise();
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param param the request object
     */
    public postVideosUploadComplete(param: VideosApiPostVideosUploadCompleteRequest, options?: ConfigurationOptions): Promise<Video> {
        return this.api.postVideosUploadComplete(param.request,  options).toPromise();
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param param the request object
     */
    public postVideosUploadInitWithHttpInfo(param: VideosApiPostVideosUploadInitRequest, options?: ConfigurationOptions): Promise<HttpInfo<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse>> {
        return this.api.postVideosUploadInitWithHttpInfo(param.request,  options).toPromise();
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param param the request object
     */
    public postVideosUploadInit(param: VideosApiPostVideosUploadInitRequest, options?: ConfigurationOptions): Promise<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse> {
        return this.api.postVideosUploadInit(param.request,  options).toPromise();
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param param the request object
     */
    public postVideosVideoIdAudioTracksWithHttpInfo(param: VideosApiPostVideosVideoIdAudioTracksRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<AudioTrack>>> {
        return this.api.postVideosVideoIdAudioTracksWithHttpInfo(param.videoId, param.files, param.languageCodes, param.labels,  options).toPromise();
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param param the request object
     */
    public postVideosVideoIdAudioTracks(param: VideosApiPostVideosVideoIdAudioTracksRequest, options?: ConfigurationOptions): Promise<Array<AudioTrack>> {
        return this.api.postVideosVideoIdAudioTracks(param.videoId, param.files, param.languageCodes, param.labels,  options).toPromise();
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param param the request object
     */
    public postVideosVideoIdSubtitlesWithHttpInfo(param: VideosApiPostVideosVideoIdSubtitlesRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<Subtitle>>> {
        return this.api.postVideosVideoIdSubtitlesWithHttpInfo(param.videoId, param.files, param.languageCodes, param.labels,  options).toPromise();
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param param the request object
     */
    public postVideosVideoIdSubtitles(param: VideosApiPostVideosVideoIdSubtitlesRequest, options?: ConfigurationOptions): Promise<Array<Subtitle>> {
        return this.api.postVideosVideoIdSubtitles(param.videoId, param.files, param.languageCodes, param.labels,  options).toPromise();
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param param the request object
     */
    public putVideosVideoIdAudioTracksLangCodeWithHttpInfo(param: VideosApiPutVideosVideoIdAudioTracksLangCodeRequest, options?: ConfigurationOptions): Promise<HttpInfo<AudioTrack>> {
        return this.api.putVideosVideoIdAudioTracksLangCodeWithHttpInfo(param.videoId, param.langCode, param.file, param.label,  options).toPromise();
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param param the request object
     */
    public putVideosVideoIdAudioTracksLangCode(param: VideosApiPutVideosVideoIdAudioTracksLangCodeRequest, options?: ConfigurationOptions): Promise<AudioTrack> {
        return this.api.putVideosVideoIdAudioTracksLangCode(param.videoId, param.langCode, param.file, param.label,  options).toPromise();
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param param the request object
     */
    public putVideosVideoIdChaptersWithHttpInfo(param: VideosApiPutVideosVideoIdChaptersRequest, options?: ConfigurationOptions): Promise<HttpInfo<UpdateChaptersResponse>> {
        return this.api.putVideosVideoIdChaptersWithHttpInfo(param.videoId, param.request,  options).toPromise();
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param param the request object
     */
    public putVideosVideoIdChapters(param: VideosApiPutVideosVideoIdChaptersRequest, options?: ConfigurationOptions): Promise<UpdateChaptersResponse> {
        return this.api.putVideosVideoIdChapters(param.videoId, param.request,  options).toPromise();
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param param the request object
     */
    public putVideosVideoIdSubtitlesLangCodeWithHttpInfo(param: VideosApiPutVideosVideoIdSubtitlesLangCodeRequest, options?: ConfigurationOptions): Promise<HttpInfo<Subtitle>> {
        return this.api.putVideosVideoIdSubtitlesLangCodeWithHttpInfo(param.videoId, param.langCode, param.file, param.label,  options).toPromise();
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param param the request object
     */
    public putVideosVideoIdSubtitlesLangCode(param: VideosApiPutVideosVideoIdSubtitlesLangCodeRequest, options?: ConfigurationOptions): Promise<Subtitle> {
        return this.api.putVideosVideoIdSubtitlesLangCode(param.videoId, param.langCode, param.file, param.label,  options).toPromise();
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param param the request object
     */
    public putVideosVideoIdThumbnailWithHttpInfo(param: VideosApiPutVideosVideoIdThumbnailRequest, options?: ConfigurationOptions): Promise<HttpInfo<Video>> {
        return this.api.putVideosVideoIdThumbnailWithHttpInfo(param.videoId, param.thumbnail,  options).toPromise();
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param param the request object
     */
    public putVideosVideoIdThumbnail(param: VideosApiPutVideosVideoIdThumbnailRequest, options?: ConfigurationOptions): Promise<Video> {
        return this.api.putVideosVideoIdThumbnail(param.videoId, param.thumbnail,  options).toPromise();
    }

}
