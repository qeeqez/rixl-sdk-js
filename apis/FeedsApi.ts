// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { GithubComQeeqezApiInternalErrorsErrorResponse } from '../models/GithubComQeeqezApiInternalErrorsErrorResponse';
import { PaginationPaginatedResponsePost } from '../models/PaginationPaginatedResponsePost';
import { Post } from '../models/Post';

/**
 * no description
 */
export class FeedsApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Retrieve posts in a feed, with pagination.
     * List posts in a feed
     * @param feedId Feed ID
     * @param limit Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param offset Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public async getFeedsFeedId(feedId: string, limit?: number, offset?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feedId' is not null or undefined
        if (feedId === null || feedId === undefined) {
            throw new RequiredError("FeedsApi", "getFeedsFeedId", "feedId");
        }




        // Path Params
        const localVarPath = '/feeds/{feedId}'
            .replace('{' + 'feedId' + '}', encodeURIComponent(String(feedId)));

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


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve posts in a feed by a specific creator, with pagination.
     * List posts by creator
     * @param feedId Feed ID
     * @param creatorId Creator ID
     * @param limit Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param offset Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     */
    public async getFeedsFeedIdCreatorsCreatorId(feedId: string, creatorId: string, limit?: number, offset?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feedId' is not null or undefined
        if (feedId === null || feedId === undefined) {
            throw new RequiredError("FeedsApi", "getFeedsFeedIdCreatorsCreatorId", "feedId");
        }


        // verify required parameter 'creatorId' is not null or undefined
        if (creatorId === null || creatorId === undefined) {
            throw new RequiredError("FeedsApi", "getFeedsFeedIdCreatorsCreatorId", "creatorId");
        }




        // Path Params
        const localVarPath = '/feeds/{feedId}/creators/{creatorId}'
            .replace('{' + 'feedId' + '}', encodeURIComponent(String(feedId)))
            .replace('{' + 'creatorId' + '}', encodeURIComponent(String(creatorId)));

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


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve a post from feed by its ID
     * Get a post
     * @param feedId Feed ID
     * @param postId Post ID
     */
    public async getFeedsFeedIdPostId(feedId: string, postId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'feedId' is not null or undefined
        if (feedId === null || feedId === undefined) {
            throw new RequiredError("FeedsApi", "getFeedsFeedIdPostId", "feedId");
        }


        // verify required parameter 'postId' is not null or undefined
        if (postId === null || postId === undefined) {
            throw new RequiredError("FeedsApi", "getFeedsFeedIdPostId", "postId");
        }


        // Path Params
        const localVarPath = '/feeds/{feedId}/{postId}'
            .replace('{' + 'feedId' + '}', encodeURIComponent(String(feedId)))
            .replace('{' + 'postId' + '}', encodeURIComponent(String(postId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class FeedsApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getFeedsFeedId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getFeedsFeedIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PaginationPaginatedResponsePost >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PaginationPaginatedResponsePost = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponsePost", ""
            ) as PaginationPaginatedResponsePost;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid feed ID or query parameters", body, response.headers);
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
            const body: PaginationPaginatedResponsePost = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponsePost", ""
            ) as PaginationPaginatedResponsePost;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getFeedsFeedIdCreatorsCreatorId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getFeedsFeedIdCreatorsCreatorIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PaginationPaginatedResponsePost >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PaginationPaginatedResponsePost = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponsePost", ""
            ) as PaginationPaginatedResponsePost;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid feed ID, creator ID, or query parameters", body, response.headers);
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
            const body: PaginationPaginatedResponsePost = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponsePost", ""
            ) as PaginationPaginatedResponsePost;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getFeedsFeedIdPostId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getFeedsFeedIdPostIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Post >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Post = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Post", ""
            ) as Post;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Bad Request", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Not Found", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Post = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Post", ""
            ) as Post;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
