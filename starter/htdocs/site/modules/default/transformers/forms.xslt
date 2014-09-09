<?xml version='1.0' encoding="UTF-8"?>
<xsl:stylesheet
        version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="field[ancestor::component[@type='form' and @exttype!='grid']]">
        <div>
            <xsl:attribute name="class">form-group<xsl:if test="not(@nullable) and @type!='boolean'"> required</xsl:if></xsl:attribute>
            <xsl:apply-templates select="." mode="field_name"/>
            <xsl:apply-templates select="." mode="field_content"/>
        </div>
    </xsl:template>

    <xsl:template match="field[ancestor::component[@type='form' and @exttype!='grid']]" mode="field_name">
        <xsl:if test="@title and @type!='boolean'">
            <div class="name">
                <label for="{@name}"><xsl:value-of select="@title" disable-output-escaping="yes"/></label>
                <xsl:if test="not(@nullable) and not(ancestor::component/@exttype='grid') and not(ancestor::component[@class='TextBlockSource'])"><span class="danger">*</span></xsl:if>
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="field[ancestor::component[@type='form' and @exttype!='grid']]" mode="field_input">
        <input class="form-control">
            <xsl:call-template name="FORM_ELEMENT_ATTRIBUTES"/>
        </input>
    </xsl:template>

    <!-- поле для почтового адреса (email) -->
    <xsl:template match="field[@type='email'][ancestor::component[@type='form' and @exttype!='grid']]" mode="field_input">
        <input class="form-control">
            <xsl:call-template name="FORM_ELEMENT_ATTRIBUTES"/>
        </input>
    </xsl:template>

    <!-- поле для телефона (phone)-->
    <xsl:template match="field[@type='phone'][ancestor::component[@type='form' and @exttype!='grid']]" mode="field_input">
        <input class="form-control">
            <xsl:call-template name="FORM_ELEMENT_ATTRIBUTES"/>
        </input>
    </xsl:template>

    <!-- поле логического типа (boolean) -->
    <xsl:template match="field[@type='boolean'][ancestor::component[@type='form' and @exttype!='grid']]" mode="field_input">
        <xsl:variable name="FIELD_NAME">
            <xsl:choose>
                <xsl:when test="@tableName"><xsl:value-of select="@tableName"/><xsl:if test="@language">[<xsl:value-of select="@language"/>]</xsl:if>[<xsl:value-of select="@name"/>]</xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="@name"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <input type="hidden" name="{$FIELD_NAME}" value="0"/>
        <input class="checkbox" type="checkbox" id="{@name}" name="{$FIELD_NAME}" value="1">
            <xsl:if test=". = 1">
                <xsl:attribute name="checked">checked</xsl:attribute>
            </xsl:if>
        </input>
        <label for="{@name}">
            <xsl:value-of select="concat(' ', @title)" disable-output-escaping="yes"/>
        </label>
    </xsl:template>

</xsl:stylesheet>