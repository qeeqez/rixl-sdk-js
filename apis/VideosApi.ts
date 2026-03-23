// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AudioTrack } from '../models/AudioTrack';
import { AudioTrackDelete } from '../models/AudioTrackDelete';
import { GithubComQeeqezApiInternalErrorsErrorResponse } from '../models/GithubComQeeqezApiInternalErrorsErrorResponse';
import { GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest } from '../models/GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest';
import { GithubComQeeqezApiInternalVideosHandlerUploadInitResponse } from '../models/GithubComQeeqezApiInternalVideosHandlerUploadInitResponse';
import { InternalVideosHandlerSubtitlesLanguageResponse } from '../models/InternalVideosHandlerSubtitlesLanguageResponse';
import { PaginationPaginatedResponseVideo } from '../models/PaginationPaginatedResponseVideo';
import { Subtitle } from '../models/Subtitle';
import { SubtitleDelete } from '../models/SubtitleDelete';
import { UpdateChaptersRequest } from '../models/UpdateChaptersRequest';
import { UpdateChaptersResponse } from '../models/UpdateChaptersResponse';
import { Video } from '../models/Video';
import { VideoUploadInitRequest } from '../models/VideoUploadInitRequest';

/**
 * no description
 */
export class VideosApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Remove all additional audio tracks from a video using API key authentication
     * Delete all audio tracks
     * @param videoId Video ID
     */
    public async deleteVideosVideoIdAudioTracks(videoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdAudioTracks", "videoId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/audio-tracks'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove an audio track for a specific language using API key authentication
     * Delete audio track by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public async deleteVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdAudioTracksLangCode", "videoId");
        }


        // verify required parameter 'langCode' is not null or undefined
        if (langCode === null || langCode === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdAudioTracksLangCode", "langCode");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/audio-tracks/{lang_code}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'lang_code' + '}', encodeURIComponent(String(langCode)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove an additional audio track from a video using API key authentication
     * Delete audio track
     * @param videoId Video ID
     * @param trackId Audio Track ID
     */
    public async deleteVideosVideoIdAudioTracksTrackId(videoId: string, trackId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdAudioTracksTrackId", "videoId");
        }


        // verify required parameter 'trackId' is not null or undefined
        if (trackId === null || trackId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdAudioTracksTrackId", "trackId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/audio-tracks/{trackId}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'trackId' + '}', encodeURIComponent(String(trackId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove all chapters from a video using API key authentication
     * Delete video chapters
     * @param videoId Video ID
     */
    public async deleteVideosVideoIdChapters(videoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdChapters", "videoId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/chapters'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete a video by its ID within a project
     * Delete video
     * @param videoId Video ID
     */
    public async deleteVideosVideoIdDelete(videoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdDelete", "videoId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/delete'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove all subtitles from a video using API key authentication
     * Delete all subtitles
     * @param videoId Video ID
     */
    public async deleteVideosVideoIdSubtitles(videoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdSubtitles", "videoId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/subtitles'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove a subtitle for a specific language using API key authentication
     * Delete subtitle by language
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     */
    public async deleteVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdSubtitlesLangCode", "videoId");
        }


        // verify required parameter 'langCode' is not null or undefined
        if (langCode === null || langCode === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdSubtitlesLangCode", "langCode");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/subtitles/{lang_code}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'lang_code' + '}', encodeURIComponent(String(langCode)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove a subtitle from a video using API key authentication
     * Delete subtitle
     * @param videoId Video ID
     * @param subtitleId Subtitle ID
     */
    public async deleteVideosVideoIdSubtitlesSubtitleId(videoId: string, subtitleId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdSubtitlesSubtitleId", "videoId");
        }


        // verify required parameter 'subtitleId' is not null or undefined
        if (subtitleId === null || subtitleId === undefined) {
            throw new RequiredError("VideosApi", "deleteVideosVideoIdSubtitlesSubtitleId", "subtitleId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/subtitles/{subtitleId}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'subtitleId' + '}', encodeURIComponent(String(subtitleId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve all videos for a specific project, with pagination and sorting.
     * List videos for a project
     * @param limit Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param offset Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param sort Field to sort by (created_at, name, size, updated_at, duration)
     * @param order Sort order (asc, desc)
     */
    public async getVideos(limit?: number, offset?: number, sort?: string, order?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;





        // Path Params
        const localVarPath = '/videos';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (limit !== undefined) {
            requestContext.setQueryParam("limit", ObjectSerializer.serialize(limit, "number", ""));
        }

        // Query Params
        if (offset !== undefined) {
            requestContext.setQueryParam("offset", ObjectSerializer.serialize(offset, "number", ""));
        }

        // Query Params
        if (sort !== undefined) {
            requestContext.setQueryParam("sort", ObjectSerializer.serialize(sort, "string", ""));
        }

        // Query Params
        if (order !== undefined) {
            requestContext.setQueryParam("order", ObjectSerializer.serialize(order, "string", ""));
        }


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get list of supported languages for subtitles
     * List available subtitle languages
     */
    public async getVideosLanguages(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/videos/languages';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve a video by its ID for a specific project.
     * Get a video
     * @param videoId Video ID
     */
    public async getVideosVideoId(videoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "getVideosVideoId", "videoId");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Mark a video upload as complete after successful upload to storage using API key authentication
     * Upload: Mark as complete
     * @param request Video upload completion request
     */
    public async postVideosUploadComplete(request: GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'request' is not null or undefined
        if (request === null || request === undefined) {
            throw new RequiredError("VideosApi", "postVideosUploadComplete", "request");
        }


        // Path Params
        const localVarPath = '/videos/upload/complete';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(request, "GithubComQeeqezApiInternalVideosHandlerUploadCompleteRequest", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Initialize a video upload and get presigned URLs for video and poster using API key authentication
     * Upload: Init
     * @param request Video upload initialization request
     */
    public async postVideosUploadInit(request: VideoUploadInitRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'request' is not null or undefined
        if (request === null || request === undefined) {
            throw new RequiredError("VideosApi", "postVideosUploadInit", "request");
        }


        // Path Params
        const localVarPath = '/videos/upload/init';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(request, "VideoUploadInitRequest", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Replace all audio tracks with the provided ones using API key authentication
     * Bulk upsert video audio tracks
     * @param videoId Video ID
     * @param files Audio files (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public async postVideosVideoIdAudioTracks(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdAudioTracks", "videoId");
        }


        // verify required parameter 'files' is not null or undefined
        if (files === null || files === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdAudioTracks", "files");
        }


        // verify required parameter 'languageCodes' is not null or undefined
        if (languageCodes === null || languageCodes === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdAudioTracks", "languageCodes");
        }


        // verify required parameter 'labels' is not null or undefined
        if (labels === null || labels === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdAudioTracks", "labels");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/audio-tracks'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (files) {
            // TODO: replace .append with .set
            localVarFormParams.append('files', files.join(COLLECTION_FORMATS["csv"]));
        }
        if (languageCodes !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('language_codes', languageCodes as any);
        }
        if (labels !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('labels', labels as any);
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Replace all subtitles with the provided ones using API key authentication
     * Bulk upsert video subtitles
     * @param videoId Video ID
     * @param files Subtitle files (.srt or .vtt)
     * @param languageCodes Comma-separated language codes
     * @param labels Comma-separated labels
     */
    public async postVideosVideoIdSubtitles(videoId: string, files: Array<HttpFile>, languageCodes: string, labels: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdSubtitles", "videoId");
        }


        // verify required parameter 'files' is not null or undefined
        if (files === null || files === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdSubtitles", "files");
        }


        // verify required parameter 'languageCodes' is not null or undefined
        if (languageCodes === null || languageCodes === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdSubtitles", "languageCodes");
        }


        // verify required parameter 'labels' is not null or undefined
        if (labels === null || labels === undefined) {
            throw new RequiredError("VideosApi", "postVideosVideoIdSubtitles", "labels");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/subtitles'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (files) {
            // TODO: replace .append with .set
            localVarFormParams.append('files', files.join(COLLECTION_FORMATS["csv"]));
        }
        if (languageCodes !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('language_codes', languageCodes as any);
        }
        if (labels !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('labels', labels as any);
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Add or replace an audio track for a specific language using API key authentication
     * Upsert video audio track
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Audio file (.mp3, .opus, .flac, .wav, .ac3, .m4a, .aac)
     * @param label Label (e.g. English)
     */
    public async putVideosVideoIdAudioTracksLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdAudioTracksLangCode", "videoId");
        }


        // verify required parameter 'langCode' is not null or undefined
        if (langCode === null || langCode === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdAudioTracksLangCode", "langCode");
        }


        // verify required parameter 'file' is not null or undefined
        if (file === null || file === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdAudioTracksLangCode", "file");
        }



        // Path Params
        const localVarPath = '/videos/{videoId}/audio-tracks/{lang_code}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'lang_code' + '}', encodeURIComponent(String(langCode)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (file !== undefined) {
             // TODO: replace .append with .set
             if (localVarFormParams instanceof FormData) {
                 localVarFormParams.append('file', file, file.name);
             }
        }
        if (label !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('label', label as any);
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Replace all chapters for a video (atomic PUT operation) using API key authentication
     * Update video chapters
     * @param videoId Video ID
     * @param request Chapters array
     */
    public async putVideosVideoIdChapters(videoId: string, request: UpdateChaptersRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdChapters", "videoId");
        }


        // verify required parameter 'request' is not null or undefined
        if (request === null || request === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdChapters", "request");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/chapters'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(request, "UpdateChaptersRequest", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Add or replace a subtitle for a specific language using API key authentication
     * Upsert video subtitle
     * @param videoId Video ID
     * @param langCode Language Code (BCP 47)
     * @param file Subtitle file (.srt or .vtt)
     * @param label Label (e.g. English)
     */
    public async putVideosVideoIdSubtitlesLangCode(videoId: string, langCode: string, file: HttpFile, label?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdSubtitlesLangCode", "videoId");
        }


        // verify required parameter 'langCode' is not null or undefined
        if (langCode === null || langCode === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdSubtitlesLangCode", "langCode");
        }


        // verify required parameter 'file' is not null or undefined
        if (file === null || file === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdSubtitlesLangCode", "file");
        }



        // Path Params
        const localVarPath = '/videos/{videoId}/subtitles/{lang_code}'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)))
            .replace('{' + 'lang_code' + '}', encodeURIComponent(String(langCode)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (file !== undefined) {
             // TODO: replace .append with .set
             if (localVarFormParams instanceof FormData) {
                 localVarFormParams.append('file', file, file.name);
             }
        }
        if (label !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('label', label as any);
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["ApiKeyAuth"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update the thumbnail image for an existing video
     * Update video thumbnail
     * @param videoId Video ID
     * @param thumbnail Thumbnail image file (max 5MB, image/_*)
     */
    public async putVideosVideoIdThumbnail(videoId: string, thumbnail: HttpFile, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoId' is not null or undefined
        if (videoId === null || videoId === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdThumbnail", "videoId");
        }


        // verify required parameter 'thumbnail' is not null or undefined
        if (thumbnail === null || thumbnail === undefined) {
            throw new RequiredError("VideosApi", "putVideosVideoIdThumbnail", "thumbnail");
        }


        // Path Params
        const localVarPath = '/videos/{videoId}/thumbnail'
            .replace('{' + 'videoId' + '}', encodeURIComponent(String(videoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (thumbnail !== undefined) {
             // TODO: replace .append with .set
             if (localVarFormParams instanceof FormData) {
                 localVarFormParams.append('thumbnail', thumbnail, thumbnail.name);
             }
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class VideosApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdAudioTracks
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdAudioTracksWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AudioTrackDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdAudioTracksLangCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdAudioTracksLangCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AudioTrackDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdAudioTracksTrackId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdAudioTracksTrackIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AudioTrackDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Forbidden", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: AudioTrackDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrackDelete", ""
            ) as AudioTrackDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdChapters
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdChaptersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<UpdateChaptersResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UpdateChaptersResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateChaptersResponse", ""
            ) as UpdateChaptersResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized - Invalid API key", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Video not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to delete chapters", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UpdateChaptersResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateChaptersResponse", ""
            ) as UpdateChaptersResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("204", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid project ID or video ID", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Video not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to delete video", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdSubtitles
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdSubtitlesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubtitleDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdSubtitlesLangCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdSubtitlesLangCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubtitleDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteVideosVideoIdSubtitlesSubtitleId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteVideosVideoIdSubtitlesSubtitleIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<SubtitleDelete >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Forbidden", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Not Found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Internal Server Error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: SubtitleDelete = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "SubtitleDelete", ""
            ) as SubtitleDelete;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getVideos
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getVideosWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PaginationPaginatedResponseVideo >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PaginationPaginatedResponseVideo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponseVideo", ""
            ) as PaginationPaginatedResponseVideo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid query parameters", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Forbidden", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Internal server error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: PaginationPaginatedResponseVideo = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponseVideo", ""
            ) as PaginationPaginatedResponseVideo;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getVideosLanguages
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getVideosLanguagesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<InternalVideosHandlerSubtitlesLanguageResponse> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<InternalVideosHandlerSubtitlesLanguageResponse> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<InternalVideosHandlerSubtitlesLanguageResponse>", ""
            ) as Array<InternalVideosHandlerSubtitlesLanguageResponse>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<InternalVideosHandlerSubtitlesLanguageResponse> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<InternalVideosHandlerSubtitlesLanguageResponse>", ""
            ) as Array<InternalVideosHandlerSubtitlesLanguageResponse>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getVideosVideoId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getVideosVideoIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Video >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid video ID", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Forbidden", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Video not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Internal server error", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postVideosUploadComplete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postVideosUploadCompleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Video >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid request body", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized - Invalid API key", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "File not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to complete upload", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postVideosUploadInit
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postVideosUploadInitWithHttpInfo(response: ResponseContext): Promise<HttpInfo<GithubComQeeqezApiInternalVideosHandlerUploadInitResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalVideosHandlerUploadInitResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalVideosHandlerUploadInitResponse", ""
            ) as GithubComQeeqezApiInternalVideosHandlerUploadInitResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid request body", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized - Invalid API key", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to initialize upload", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: GithubComQeeqezApiInternalVideosHandlerUploadInitResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalVideosHandlerUploadInitResponse", ""
            ) as GithubComQeeqezApiInternalVideosHandlerUploadInitResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postVideosVideoIdAudioTracks
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postVideosVideoIdAudioTracksWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<AudioTrack> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<AudioTrack> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<AudioTrack>", ""
            ) as Array<AudioTrack>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<AudioTrack> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<AudioTrack>", ""
            ) as Array<AudioTrack>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postVideosVideoIdSubtitles
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postVideosVideoIdSubtitlesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Subtitle> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Subtitle> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Subtitle>", ""
            ) as Array<Subtitle>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Subtitle> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Subtitle>", ""
            ) as Array<Subtitle>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to putVideosVideoIdAudioTracksLangCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async putVideosVideoIdAudioTracksLangCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AudioTrack >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AudioTrack = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrack", ""
            ) as AudioTrack;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: AudioTrack = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AudioTrack", ""
            ) as AudioTrack;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to putVideosVideoIdChapters
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async putVideosVideoIdChaptersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<UpdateChaptersResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UpdateChaptersResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateChaptersResponse", ""
            ) as UpdateChaptersResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid request body or video duration not available", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized - Invalid API key", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Video not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to update chapters", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UpdateChaptersResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UpdateChaptersResponse", ""
            ) as UpdateChaptersResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to putVideosVideoIdSubtitlesLangCode
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async putVideosVideoIdSubtitlesLangCodeWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Subtitle >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Subtitle = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Subtitle", ""
            ) as Subtitle;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Subtitle = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Subtitle", ""
            ) as Subtitle;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to putVideosVideoIdThumbnail
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async putVideosVideoIdThumbnailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Video >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid file or request", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Unauthorized", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Access denied", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Video not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Upload or update failed", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Video = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Video", ""
            ) as Video;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
