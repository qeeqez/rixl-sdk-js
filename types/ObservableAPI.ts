import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { FeedsApiRequestFactory, FeedsApiResponseProcessor} from "../apis/FeedsApi";
export class ObservableFeedsApi {
    private requestFactory: FeedsApiRequestFactory;
    private responseProcessor: FeedsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: FeedsApiRequestFactory,
        responseProcessor?: FeedsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new FeedsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new FeedsApiResponseProcessor();
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param feedId Feed ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdWithHttpInfo(feedId: string, limit?: number, offset?: number, _options?: ConfigurationOptions): Observable<HttpInfo<PaginationPaginatedResponsePost>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getFeedsFeedId(feedId, limit, offset, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getFeedsFeedIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param feedId Feed ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedId(feedId: string, limit?: number, offset?: number, _options?: ConfigurationOptions): Observable<PaginationPaginatedResponsePost> {
        return this.getFeedsFeedIdWithHttpInfo(feedId, limit, offset, _options).pipe(map((apiResponse: HttpInfo<PaginationPaginatedResponsePost>) => apiResponse.data));
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param feedId Feed ID
     * @param creatorId Creator ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(feedId: string, creatorId: string, limit?: number, offset?: number, _options?: ConfigurationOptions): Observable<HttpInfo<PaginationPaginatedResponsePost>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getFeedsFeedIdCreatorsCreatorId(feedId, creatorId, limit, offset, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param feedId Feed ID
     * @param creatorId Creator ID
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public getFeedsFeedIdCreatorsCreatorId(feedId: string, creatorId: string, limit?: number, offset?: number, _options?: ConfigurationOptions): Observable<PaginationPaginatedResponsePost> {
        return this.getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(feedId, creatorId, limit, offset, _options).pipe(map((apiResponse: HttpInfo<PaginationPaginatedResponsePost>) => apiResponse.data));
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param feedId Feed ID
     * @param postId Post ID
     */
    public getFeedsFeedIdPostIdWithHttpInfo(feedId: string, postId: string, _options?: ConfigurationOptions): Observable<HttpInfo<Post>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getFeedsFeedIdPostId(feedId, postId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getFeedsFeedIdPostIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param feedId Feed ID
     * @param postId Post ID
     */
    public getFeedsFeedIdPostId(feedId: string, postId: string, _options?: ConfigurationOptions): Observable<Post> {
        return this.getFeedsFeedIdPostIdWithHttpInfo(feedId, postId, _options).pipe(map((apiResponse: HttpInfo<Post>) => apiResponse.data));
    }

}

import { ImagesApiRequestFactory, ImagesApiResponseProcessor} from "../apis/ImagesApi";
export class ObservableImagesApi {
    private requestFactory: ImagesApiRequestFactory;
    private responseProcessor: ImagesApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ImagesApiRequestFactory,
        responseProcessor?: ImagesApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ImagesApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ImagesApiResponseProcessor();
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param imageId Image ID
     */
    public deleteImagesImageIdWithHttpInfo(imageId: string, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteImagesImageId(imageId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteImagesImageIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param imageId Image ID
     */
    public deleteImagesImageId(imageId: string, _options?: ConfigurationOptions): Observable<void> {
        return this.deleteImagesImageIdWithHttpInfo(imageId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at)
     * @param [order] Sort order (asc, desc)
     */
    public getImagesWithHttpInfo(limit?: number, offset?: number, sort?: string, order?: string, _options?: ConfigurationOptions): Observable<HttpInfo<PaginationPaginatedResponseImage>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getImages(limit, offset, sort, order, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getImagesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at)
     * @param [order] Sort order (asc, desc)
     */
    public getImages(limit?: number, offset?: number, sort?: string, order?: string, _options?: ConfigurationOptions): Observable<PaginationPaginatedResponseImage> {
        return this.getImagesWithHttpInfo(limit, offset, sort, order, _options).pipe(map((apiResponse: HttpInfo<PaginationPaginatedResponseImage>) => apiResponse.data));
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param imageId Image ID
     */
    public getImagesImageIdWithHttpInfo(imageId: string, _options?: ConfigurationOptions): Observable<HttpInfo<Image>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getImagesImageId(imageId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getImagesImageIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param imageId Image ID
     */
    public getImagesImageId(imageId: string, _options?: ConfigurationOptions): Observable<Image> {
        return this.getImagesImageIdWithHttpInfo(imageId, _options).pipe(map((apiResponse: HttpInfo<Image>) => apiResponse.data));
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param request Upload completion request
     */
    public postImagesUploadCompleteWithHttpInfo(request: InternalImagesHandlerCompleteRequest, _options?: ConfigurationOptions): Observable<HttpInfo<Image>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postImagesUploadComplete(request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postImagesUploadCompleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param request Upload completion request
     */
    public postImagesUploadComplete(request: InternalImagesHandlerCompleteRequest, _options?: ConfigurationOptions): Observable<Image> {
        return this.postImagesUploadCompleteWithHttpInfo(request, _options).pipe(map((apiResponse: HttpInfo<Image>) => apiResponse.data));
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param request Upload initialization request
     */
    public postImagesUploadInitWithHttpInfo(request: InternalImagesHandlerUploadInitRequest, _options?: ConfigurationOptions): Observable<HttpInfo<InternalImagesHandlerInitResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postImagesUploadInit(request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postImagesUploadInitWithHttpInfo(rsp)));
            }));
    }

    /**
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param request Upload initialization request
     */
    public postImagesUploadInit(request: InternalImagesHandlerUploadInitRequest, _options?: ConfigurationOptions): Observable<InternalImagesHandlerInitResponse> {
        return this.postImagesUploadInitWithHttpInfo(request, _options).pipe(map((apiResponse: HttpInfo<InternalImagesHandlerInitResponse>) => apiResponse.data));
    }

}

import { VideosApiRequestFactory, VideosApiResponseProcessor} from "../apis/VideosApi";
export class ObservableVideosApi {
    private requestFactory: VideosApiRequestFactory;
    private responseProcessor: VideosApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: VideosApiRequestFactory,
        responseProcessor?: VideosApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new VideosApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new VideosApiResponseProcessor();
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param videoId Video ID
     */
    public deleteVideosVideoIdAudioTracksWithHttpInfo(videoId: string, _options?: ConfigurationOptions): Observable<HttpInfo<AudioTrackDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdAudioTracks(videoId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdAudioTracksWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param videoId Video ID
     */
    public deleteVideosVideoIdAudioTracks(videoId: string, _options?: ConfigurationOptions): Observable<AudioTrackDelete> {
        return this.deleteVideosVideoIdAudioTracksWithHttpInfo(videoId, _options).pipe(map((apiResponse: HttpInfo<AudioTrackDelete>) => apiResponse.data));
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId: string, langCode: string, _options?: ConfigurationOptions): Observable<HttpInfo<AudioTrackDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdAudioTracksLangCode(videoId, langCode, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, _options?: ConfigurationOptions): Observable<AudioTrackDelete> {
        return this.deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId, langCode, _options).pipe(map((apiResponse: HttpInfo<AudioTrackDelete>) => apiResponse.data));
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param videoId Video ID
     * @param trackId Audio Track ID
     */
    public deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(videoId: string, trackId: string, _options?: ConfigurationOptions): Observable<HttpInfo<AudioTrackDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdAudioTracksTrackId(videoId, trackId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param videoId Video ID
     * @param trackId Audio Track ID
     */
    public deleteVideosVideoIdAudioTracksTrackId(videoId: string, trackId: string, _options?: ConfigurationOptions): Observable<AudioTrackDelete> {
        return this.deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(videoId, trackId, _options).pipe(map((apiResponse: HttpInfo<AudioTrackDelete>) => apiResponse.data));
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param videoId Video ID
     */
    public deleteVideosVideoIdChaptersWithHttpInfo(videoId: string, _options?: ConfigurationOptions): Observable<HttpInfo<UpdateChaptersResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdChapters(videoId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdChaptersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param videoId Video ID
     */
    public deleteVideosVideoIdChapters(videoId: string, _options?: ConfigurationOptions): Observable<UpdateChaptersResponse> {
        return this.deleteVideosVideoIdChaptersWithHttpInfo(videoId, _options).pipe(map((apiResponse: HttpInfo<UpdateChaptersResponse>) => apiResponse.data));
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param videoId Video ID
     */
    public deleteVideosVideoIdDeleteWithHttpInfo(videoId: string, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdDelete(videoId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param videoId Video ID
     */
    public deleteVideosVideoIdDelete(videoId: string, _options?: ConfigurationOptions): Observable<void> {
        return this.deleteVideosVideoIdDeleteWithHttpInfo(videoId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param videoId Video ID
     */
    public deleteVideosVideoIdSubtitlesWithHttpInfo(videoId: string, _options?: ConfigurationOptions): Observable<HttpInfo<SubtitleDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdSubtitles(videoId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdSubtitlesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param videoId Video ID
     */
    public deleteVideosVideoIdSubtitles(videoId: string, _options?: ConfigurationOptions): Observable<SubtitleDelete> {
        return this.deleteVideosVideoIdSubtitlesWithHttpInfo(videoId, _options).pipe(map((apiResponse: HttpInfo<SubtitleDelete>) => apiResponse.data));
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId: string, langCode: string, _options?: ConfigurationOptions): Observable<HttpInfo<SubtitleDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdSubtitlesLangCode(videoId, langCode, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public deleteVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, _options?: ConfigurationOptions): Observable<SubtitleDelete> {
        return this.deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId, langCode, _options).pipe(map((apiResponse: HttpInfo<SubtitleDelete>) => apiResponse.data));
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param videoId Video ID
     * @param subtitleId Subtitle ID
     */
    public deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(videoId: string, subtitleId: string, _options?: ConfigurationOptions): Observable<HttpInfo<SubtitleDelete>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteVideosVideoIdSubtitlesSubtitleId(videoId, subtitleId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param videoId Video ID
     * @param subtitleId Subtitle ID
     */
    public deleteVideosVideoIdSubtitlesSubtitleId(videoId: string, subtitleId: string, _options?: ConfigurationOptions): Observable<SubtitleDelete> {
        return this.deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(videoId, subtitleId, _options).pipe(map((apiResponse: HttpInfo<SubtitleDelete>) => apiResponse.data));
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at, duration)
     * @param [order] Sort order (asc, desc)
     */
    public getVideosWithHttpInfo(limit?: number, offset?: number, sort?: string, order?: string, _options?: ConfigurationOptions): Observable<HttpInfo<PaginationPaginatedResponseVideo>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getVideos(limit, offset, sort, order, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getVideosWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param [limit] Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param [offset] Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param [sort] Field to sort by (created_at, name, size, updated_at, duration)
     * @param [order] Sort order (asc, desc)
     */
    public getVideos(limit?: number, offset?: number, sort?: string, order?: string, _options?: ConfigurationOptions): Observable<PaginationPaginatedResponseVideo> {
        return this.getVideosWithHttpInfo(limit, offset, sort, order, _options).pipe(map((apiResponse: HttpInfo<PaginationPaginatedResponseVideo>) => apiResponse.data));
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     */
    public getVideosLanguagesWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<Array<InternalVideosHandlerSubtitlesLanguageResponse>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getVideosLanguages(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getVideosLanguagesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     */
    public getVideosLanguages(_options?: ConfigurationOptions): Observable<Array<InternalVideosHandlerSubtitlesLanguageResponse>> {
        return this.getVideosLanguagesWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<InternalVideosHandlerSubtitlesLanguageResponse>>) => apiResponse.data));
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param videoId Video ID
     */
    public getVideosVideoIdWithHttpInfo(videoId: string, _options?: ConfigurationOptions): Observable<HttpInfo<Video>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getVideosVideoId(videoId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getVideosVideoIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param videoId Video ID
     */
    public getVideosVideoId(videoId: string, _options?: ConfigurationOptions): Observable<Video> {
        return this.getVideosVideoIdWithHttpInfo(videoId, _options).pipe(map((apiResponse: HttpInfo<Video>) => apiResponse.data));
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param request Video upload completion request
     */
    public postVideosUploadCompleteWithHttpInfo(request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest, _options?: ConfigurationOptions): Observable<HttpInfo<Video>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postVideosUploadComplete(request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postVideosUploadCompleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param request Video upload completion request
     */
    public postVideosUploadComplete(request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest, _options?: ConfigurationOptions): Observable<Video> {
        return this.postVideosUploadCompleteWithHttpInfo(request, _options).pipe(map((apiResponse: HttpInfo<Video>) => apiResponse.data));
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param request Video upload initialization request
     */
    public postVideosUploadInitWithHttpInfo(request: VideoUploadInitRequest, _options?: ConfigurationOptions): Observable<HttpInfo<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postVideosUploadInit(request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postVideosUploadInitWithHttpInfo(rsp)));
            }));
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param request Video upload initialization request
     */
    public postVideosUploadInit(request: VideoUploadInitRequest, _options?: ConfigurationOptions): Observable<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse> {
        return this.postVideosUploadInitWithHttpInfo(request, _options).pipe(map((apiResponse: HttpInfo<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse>) => apiResponse.data));
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param videoId Video ID
     * @param files Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdAudioTracksWithHttpInfo(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<AudioTrack>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postVideosVideoIdAudioTracks(videoId, files, languageCodes, labels, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postVideosVideoIdAudioTracksWithHttpInfo(rsp)));
            }));
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param videoId Video ID
     * @param files Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdAudioTracks(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: ConfigurationOptions): Observable<Array<AudioTrack>> {
        return this.postVideosVideoIdAudioTracksWithHttpInfo(videoId, files, languageCodes, labels, _options).pipe(map((apiResponse: HttpInfo<Array<AudioTrack>>) => apiResponse.data));
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param videoId Video ID
     * @param files Subtitle files (.srt or .vtt)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdSubtitlesWithHttpInfo(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<Subtitle>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postVideosVideoIdSubtitles(videoId, files, languageCodes, labels, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postVideosVideoIdSubtitlesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param videoId Video ID
     * @param files Subtitle files (.srt or .vtt)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public postVideosVideoIdSubtitles(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: ConfigurationOptions): Observable<Array<Subtitle>> {
        return this.postVideosVideoIdSubtitlesWithHttpInfo(videoId, files, languageCodes, labels, _options).pipe(map((apiResponse: HttpInfo<Array<Subtitle>>) => apiResponse.data));
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: ConfigurationOptions): Observable<HttpInfo<AudioTrack>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putVideosVideoIdAudioTracksLangCode(videoId, langCode, file, label, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putVideosVideoIdAudioTracksLangCodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: ConfigurationOptions): Observable<AudioTrack> {
        return this.putVideosVideoIdAudioTracksLangCodeWithHttpInfo(videoId, langCode, file, label, _options).pipe(map((apiResponse: HttpInfo<AudioTrack>) => apiResponse.data));
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param videoId Video ID
     * @param request Chapters array
     */
    public putVideosVideoIdChaptersWithHttpInfo(videoId: string, request: UpdateChaptersRequest, _options?: ConfigurationOptions): Observable<HttpInfo<UpdateChaptersResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putVideosVideoIdChapters(videoId, request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putVideosVideoIdChaptersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param videoId Video ID
     * @param request Chapters array
     */
    public putVideosVideoIdChapters(videoId: string, request: UpdateChaptersRequest, _options?: ConfigurationOptions): Observable<UpdateChaptersResponse> {
        return this.putVideosVideoIdChaptersWithHttpInfo(videoId, request, _options).pipe(map((apiResponse: HttpInfo<UpdateChaptersResponse>) => apiResponse.data));
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Subtitle file (.srt or .vtt)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: ConfigurationOptions): Observable<HttpInfo<Subtitle>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putVideosVideoIdSubtitlesLangCode(videoId, langCode, file, label, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putVideosVideoIdSubtitlesLangCodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Subtitle file (.srt or .vtt)
     * @param [label] Label (e.g. English)
     */
    public putVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: ConfigurationOptions): Observable<Subtitle> {
        return this.putVideosVideoIdSubtitlesLangCodeWithHttpInfo(videoId, langCode, file, label, _options).pipe(map((apiResponse: HttpInfo<Subtitle>) => apiResponse.data));
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param videoId Video ID
     * @param thumbnail Thumbnail image file (max 5MB, image/_*)
     */
    public putVideosVideoIdThumbnailWithHttpInfo(videoId: string, thumbnail: HttpFile, _options?: ConfigurationOptions): Observable<HttpInfo<Video>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putVideosVideoIdThumbnail(videoId, thumbnail, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putVideosVideoIdThumbnailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param videoId Video ID
     * @param thumbnail Thumbnail image file (max 5MB, image/_*)
     */
    public putVideosVideoIdThumbnail(videoId: string, thumbnail: HttpFile, _options?: ConfigurationOptions): Observable<Video> {
        return this.putVideosVideoIdThumbnailWithHttpInfo(videoId, thumbnail, _options).pipe(map((apiResponse: HttpInfo<Video>) => apiResponse.data));
    }

}
