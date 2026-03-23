import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

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
import { ObservableFeedsApi } from './ObservableAPI';

import { FeedsApiRequestFactory, FeedsApiResponseProcessor} from "../apis/FeedsApi";
export class PromiseFeedsApi {
    private api: ObservableFeedsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: FeedsApiRequestFactory,
        responseProcessor?: FeedsApiResponseProcessor
    ) {
        this.api = new ObservableFeedsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param feedId Feed ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdWithHttpInfo(feedId: string, limit?: number, offset?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponsePost>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedIdWithHttpInfo(feedId, limit, offset, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param feedId Feed ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedId(feedId: string, limit?: number, offset?: number, _options?: PromiseConfigurationOptions): Promise<PaginationPaginatedResponsePost> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedId(feedId, limit, offset, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param feedId Feed ID
     * @param creatorId Creator ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(feedId: string, creatorId: string, limit?: number, offset?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponsePost>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(feedId, creatorId, limit, offset, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param feedId Feed ID
     * @param creatorId Creator ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdCreatorsCreatorId(feedId: string, creatorId: string, limit?: number, offset?: number, _options?: PromiseConfigurationOptions): Promise<PaginationPaginatedResponsePost> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedIdCreatorsCreatorId(feedId, creatorId, limit, offset, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param feedId Feed ID
     * @param postId Post ID
     */
    public getFeedsFeedIdPostIdWithHttpInfo(feedId: string, postId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Post>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedIdPostIdWithHttpInfo(feedId, postId, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param feedId Feed ID
     * @param postId Post ID
     */
    public getFeedsFeedIdPostId(feedId: string, postId: string, _options?: PromiseConfigurationOptions): Promise<Post> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getFeedsFeedIdPostId(feedId, postId, observableOptions);
        return result.toPromise();
    }


}



import { ObservableImagesApi } from './ObservableAPI';

import { ImagesApiRequestFactory, ImagesApiResponseProcessor} from "../apis/ImagesApi";
export class PromiseImagesApi {
    private api: ObservableImagesApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ImagesApiRequestFactory,
        responseProcessor?: ImagesApiResponseProcessor
    ) {
        this.api = new ObservableImagesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param imageId Image ID
     */
    public deleteImagesImageIdWithHttpInfo(imageId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<void>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteImagesImageIdWithHttpInfo(imageId, observableOptions);
        return result.toPromise();
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param imageId Image ID
     */
    public deleteImagesImageId(imageId: string, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteImagesImageId(imageId, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at)
     * @param [order] Sort order (asc, desc)
     */
    public getImagesWithHttpInfo(limit?: number, offset?: number, sort?: string, order?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponseImage>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getImagesWithHttpInfo(limit, offset, sort, order, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at)
     * @param [order] Sort order (asc, desc)
     */
    public getImages(limit?: number, offset?: number, sort?: string, order?: string, _options?: PromiseConfigurationOptions): Promise<PaginationPaginatedResponseImage> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getImages(limit, offset, sort, order, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param imageId Image ID
     */
    public getImagesImageIdWithHttpInfo(imageId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Image>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getImagesImageIdWithHttpInfo(imageId, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param imageId Image ID
     */
    public getImagesImageId(imageId: string, _options?: PromiseConfigurationOptions): Promise<Image> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getImagesImageId(imageId, observableOptions);
        return result.toPromise();
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param request Upload completion request
     */
    public postImagesUploadCompleteWithHttpInfo(request: InternalImagesHandlerCompleteRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Image>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postImagesUploadCompleteWithHttpInfo(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param request Upload completion request
     */
    public postImagesUploadComplete(request: InternalImagesHandlerCompleteRequest, _options?: PromiseConfigurationOptions): Promise<Image> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postImagesUploadComplete(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param request Upload initialization request
     */
    public postImagesUploadInitWithHttpInfo(request: InternalImagesHandlerUploadInitRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<InternalImagesHandlerInitResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postImagesUploadInitWithHttpInfo(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param request Upload initialization request
     */
    public postImagesUploadInit(request: InternalImagesHandlerUploadInitRequest, _options?: PromiseConfigurationOptions): Promise<InternalImagesHandlerInitResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postImagesUploadInit(request, observableOptions);
        return result.toPromise();
    }


}



import { ObservableVideosApi } from './ObservableAPI';

import { VideosApiRequestFactory, VideosApiResponseProcessor} from "../apis/VideosApi";
export class PromiseVideosApi {
    private api: ObservableVideosApi

    public constructor(
        configuration: Configuration,
        requestFactory?: VideosApiRequestFactory,
        responseProcessor?: VideosApiResponseProcessor
    ) {
        this.api = new ObservableVideosApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param videoId Video ID
     */
    public deleteVideosVideoIdAudioTracksWithHttpInfo(videoId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracksWithHttpInfo(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param videoId Video ID
     */
    public deleteVideosVideoIdAudioTracks(videoId: string, _options?: PromiseConfigurationOptions): Promise<AudioTrackDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracks(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId: string, langCode: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId, langCode, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, _options?: PromiseConfigurationOptions): Promise<AudioTrackDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracksLangCode(videoId, langCode, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param videoId Video ID
     * @param trackId Audio Track ID
     */
    public deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(videoId: string, trackId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AudioTrackDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(videoId, trackId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param videoId Video ID
     * @param trackId Audio Track ID
     */
    public deleteVideosVideoIdAudioTracksTrackId(videoId: string, trackId: string, _options?: PromiseConfigurationOptions): Promise<AudioTrackDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdAudioTracksTrackId(videoId, trackId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param videoId Video ID
     */
    public deleteVideosVideoIdChaptersWithHttpInfo(videoId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<UpdateChaptersResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdChaptersWithHttpInfo(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param videoId Video ID
     */
    public deleteVideosVideoIdChapters(videoId: string, _options?: PromiseConfigurationOptions): Promise<UpdateChaptersResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdChapters(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param videoId Video ID
     */
    public deleteVideosVideoIdDeleteWithHttpInfo(videoId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<void>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdDeleteWithHttpInfo(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param videoId Video ID
     */
    public deleteVideosVideoIdDelete(videoId: string, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdDelete(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param videoId Video ID
     */
    public deleteVideosVideoIdSubtitlesWithHttpInfo(videoId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitlesWithHttpInfo(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param videoId Video ID
     */
    public deleteVideosVideoIdSubtitles(videoId: string, _options?: PromiseConfigurationOptions): Promise<SubtitleDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitles(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId: string, langCode: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId, langCode, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, _options?: PromiseConfigurationOptions): Promise<SubtitleDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitlesLangCode(videoId, langCode, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param videoId Video ID
     * @param subtitleId Subtitle ID
     */
    public deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(videoId: string, subtitleId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<SubtitleDelete>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(videoId, subtitleId, observableOptions);
        return result.toPromise();
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param videoId Video ID
     * @param subtitleId Subtitle ID
     */
    public deleteVideosVideoIdSubtitlesSubtitleId(videoId: string, subtitleId: string, _options?: PromiseConfigurationOptions): Promise<SubtitleDelete> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteVideosVideoIdSubtitlesSubtitleId(videoId, subtitleId, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at, duration)
     * @param [order] Sort order (asc, desc)
     */
    public getVideosWithHttpInfo(limit?: number, offset?: number, sort?: string, order?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<PaginationPaginatedResponseVideo>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideosWithHttpInfo(limit, offset, sort, order, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at, duration)
     * @param [order] Sort order (asc, desc)
     */
    public getVideos(limit?: number, offset?: number, sort?: string, order?: string, _options?: PromiseConfigurationOptions): Promise<PaginationPaginatedResponseVideo> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideos(limit, offset, sort, order, observableOptions);
        return result.toPromise();
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     */
    public getVideosLanguagesWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<InternalVideosHandlerSubtitlesLanguageResponse>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideosLanguagesWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     */
    public getVideosLanguages(_options?: PromiseConfigurationOptions): Promise<Array<InternalVideosHandlerSubtitlesLanguageResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideosLanguages(observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param videoId Video ID
     */
    public getVideosVideoIdWithHttpInfo(videoId: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Video>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideosVideoIdWithHttpInfo(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param videoId Video ID
     */
    public getVideosVideoId(videoId: string, _options?: PromiseConfigurationOptions): Promise<Video> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getVideosVideoId(videoId, observableOptions);
        return result.toPromise();
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param request Video upload completion request
     */
    public postVideosUploadCompleteWithHttpInfo(request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Video>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosUploadCompleteWithHttpInfo(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param request Video upload completion request
     */
    public postVideosUploadComplete(request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest, _options?: PromiseConfigurationOptions): Promise<Video> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosUploadComplete(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param request Video upload initialization request
     */
    public postVideosUploadInitWithHttpInfo(request: VideoUploadInitRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosUploadInitWithHttpInfo(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param request Video upload initialization request
     */
    public postVideosUploadInit(request: VideoUploadInitRequest, _options?: PromiseConfigurationOptions): Promise<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosUploadInit(request, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param videoId Video ID
     * @param files Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdAudioTracksWithHttpInfo(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<AudioTrack>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosVideoIdAudioTracksWithHttpInfo(videoId, files, languageCodes, labels, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param videoId Video ID
     * @param files Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdAudioTracks(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: PromiseConfigurationOptions): Promise<Array<AudioTrack>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosVideoIdAudioTracks(videoId, files, languageCodes, labels, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param videoId Video ID
     * @param files Subtitle files (.srt or .vtt)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdSubtitlesWithHttpInfo(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<Subtitle>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosVideoIdSubtitlesWithHttpInfo(videoId, files, languageCodes, labels, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param videoId Video ID
     * @param files Subtitle files (.srt or .vtt)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdSubtitles(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: PromiseConfigurationOptions): Promise<Array<Subtitle>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postVideosVideoIdSubtitles(videoId, files, languageCodes, labels, observableOptions);
        return result.toPromise();
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<AudioTrack>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId, langCode, file, label, observableOptions);
        return result.toPromise();
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: PromiseConfigurationOptions): Promise<AudioTrack> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdAudioTracksLangCode(videoId, langCode, file, label, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param videoId Video ID
     * @param request Chapters array
     */
    public putVideosVideoIdChaptersWithHttpInfo(videoId: string, request: UpdateChaptersRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<UpdateChaptersResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdChaptersWithHttpInfo(videoId, request, observableOptions);
        return result.toPromise();
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param videoId Video ID
     * @param request Chapters array
     */
    public putVideosVideoIdChapters(videoId: string, request: UpdateChaptersRequest, _options?: PromiseConfigurationOptions): Promise<UpdateChaptersResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdChapters(videoId, request, observableOptions);
        return result.toPromise();
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Subtitle file (.srt or .vtt)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Subtitle>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId, langCode, file, label, observableOptions);
        return result.toPromise();
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Subtitle file (.srt or .vtt)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: PromiseConfigurationOptions): Promise<Subtitle> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdSubtitlesLangCode(videoId, langCode, file, label, observableOptions);
        return result.toPromise();
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param videoId Video ID
     * @param thumbnail Thumbnail image file (max 5MB, image/_*)
     */
    public putVideosVideoIdThumbnailWithHttpInfo(videoId: string, thumbnail: HttpFile, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Video>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdThumbnailWithHttpInfo(videoId, thumbnail, observableOptions);
        return result.toPromise();
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param videoId Video ID
     * @param thumbnail Thumbnail image file (max 5MB, image/_*)
     */
    public putVideosVideoIdThumbnail(videoId: string, thumbnail: HttpFile, _options?: PromiseConfigurationOptions): Promise<Video> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putVideosVideoIdThumbnail(videoId, thumbnail, observableOptions);
        return result.toPromise();
    }


}



