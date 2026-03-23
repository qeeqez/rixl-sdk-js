// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { GithubComQeeqezApiInternalErrorsErrorResponse } from '../models/GithubComQeeqezApiInternalErrorsErrorResponse';
import { Image } from '../models/Image';
import { InternalImagesHandlerCompleteRequest } from '../models/InternalImagesHandlerCompleteRequest';
import { InternalImagesHandlerInitResponse } from '../models/InternalImagesHandlerInitResponse';
import { InternalImagesHandlerUploadInitRequest } from '../models/InternalImagesHandlerUploadInitRequest';
import { PaginationPaginatedResponseImage } from '../models/PaginationPaginatedResponseImage';

/**
 * no description
 */
export class ImagesApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * delete an image by marking it as deleted
     * Delete image
     * @param imageId Image ID
     */
    public async deleteImagesImageId(imageId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'imageId' is not null or undefined
        if (imageId === null || imageId === undefined) {
            throw new RequiredError("ImagesApi", "deleteImagesImageId", "imageId");
        }


        // Path Params
        const localVarPath = '/images/{imageId}'
            .replace('{' + 'imageId' + '}', encodeURIComponent(String(imageId)));

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
     * Retrieve all images for a specific project, with pagination and sorting.
     * List images for a project
     * @param limit Maximum number of items to return in a single request. &lt;br&gt; **Default:** &#x60;25&#x60;
     * @param offset Starting point of the result set. &lt;br&gt;To get page 2 with a limit of 25, set &#x60;offset&#x60; to &#x60;25&#x60;. &lt;br&gt; **Default:** &#x60;0&#x60;
     * @param sort Field to sort by (created_at, name, size, updated_at)
     * @param order Sort order (asc, desc)
     */
    public async getImages(limit?: number, offset?: number, sort?: string, order?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;





        // Path Params
        const localVarPath = '/images';

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
     * Retrieve an image by its ID for a specific project.
     * Get image
     * @param imageId Image ID
     */
    public async getImagesImageId(imageId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'imageId' is not null or undefined
        if (imageId === null || imageId === undefined) {
            throw new RequiredError("ImagesApi", "getImagesImageId", "imageId");
        }


        // Path Params
        const localVarPath = '/images/{imageId}'
            .replace('{' + 'imageId' + '}', encodeURIComponent(String(imageId)));

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
     * Complete the upload process and create the image record using API key authentication
     * Upload: Mark as complete
     * @param request Upload completion request
     */
    public async postImagesUploadComplete(request: InternalImagesHandlerCompleteRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'request' is not null or undefined
        if (request === null || request === undefined) {
            throw new RequiredError("ImagesApi", "postImagesUploadComplete", "request");
        }


        // Path Params
        const localVarPath = '/images/upload/complete';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(request, "InternalImagesHandlerCompleteRequest", ""),
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
     * Initialize a presigned URL upload for an image file using API key authentication
     * Upload: Init
     * @param request Upload initialization request
     */
    public async postImagesUploadInit(request: InternalImagesHandlerUploadInitRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'request' is not null or undefined
        if (request === null || request === undefined) {
            throw new RequiredError("ImagesApi", "postImagesUploadInit", "request");
        }


        // Path Params
        const localVarPath = '/images/upload/init';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(request, "InternalImagesHandlerUploadInitRequest", ""),
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

}

export class ImagesApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteImagesImageId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteImagesImageIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("204", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid project ID or image ID", body, response.headers);
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
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Image not found", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to delete image", body, response.headers);
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
     * @params response Response returned by the server for a request to getImages
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getImagesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PaginationPaginatedResponseImage >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PaginationPaginatedResponseImage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponseImage", ""
            ) as PaginationPaginatedResponseImage;
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
            const body: PaginationPaginatedResponseImage = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PaginationPaginatedResponseImage", ""
            ) as PaginationPaginatedResponseImage;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getImagesImageId
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getImagesImageIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Image >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Image = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Image", ""
            ) as Image;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: GithubComQeeqezApiInternalErrorsErrorResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "GithubComQeeqezApiInternalErrorsErrorResponse", ""
            ) as GithubComQeeqezApiInternalErrorsErrorResponse;
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Invalid image ID", body, response.headers);
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
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Image not found", body, response.headers);
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
            const body: Image = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Image", ""
            ) as Image;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postImagesUploadComplete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postImagesUploadCompleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Image >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Image = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Image", ""
            ) as Image;
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
            throw new ApiException<GithubComQeeqezApiInternalErrorsErrorResponse>(response.httpStatusCode, "Failed to complete upload or create image", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Image = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Image", ""
            ) as Image;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to postImagesUploadInit
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async postImagesUploadInitWithHttpInfo(response: ResponseContext): Promise<HttpInfo<InternalImagesHandlerInitResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: InternalImagesHandlerInitResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InternalImagesHandlerInitResponse", ""
            ) as InternalImagesHandlerInitResponse;
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
            const body: InternalImagesHandlerInitResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InternalImagesHandlerInitResponse", ""
            ) as InternalImagesHandlerInitResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
